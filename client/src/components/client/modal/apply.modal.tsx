import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Divider, Modal, Row, Upload, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { callCreateResume, callUploadSingleFile } from "@/config/api";
import { useState } from "react";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
  const { isModalOpen, setIsModalOpen, jobDetail } = props;
  const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
  const user = useAppSelector((state) => state.account.user);
  const [urlCV, setUrlCV] = useState<string>("");
  const [fileCV, setFileCV] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleOkButton = async () => {
    if (!fileCV && isAuthenticated) {
      message.error("Vui lòng upload CV!");
      return;
    }

    if (!isAuthenticated) {
      setIsModalOpen(false);
      navigate(`/login?callback=${window.location.href}`);
    } else {
      if (jobDetail) {
        // Upload file khi user bấm nút "Rải CV nào"
        setIsUploading(true);
        const resUpload = await callUploadSingleFile(fileCV, "resume");
        if (resUpload && resUpload.data) {
          const uploadedFileName = resUpload.data.fileName;
          // Sau khi upload thành công, tạo resume
          const res = await callCreateResume(uploadedFileName, jobDetail?.company?._id, jobDetail?._id);
          setIsUploading(false);
          if (res.data) {
            message.success("Rải CV thành công!");
            setIsModalOpen(false);
            setFileCV(null);
            setUrlCV("");
          } else {
            notification.error({
              message: "Có lỗi xảy ra",
              description: res.message,
            });
          }
        } else {
          setIsUploading(false);
          notification.error({
            message: "Có lỗi xảy ra khi upload file",
            description: resUpload.message,
          });
        }
      }
    }
  };

  const propsUpload: UploadProps = {
    maxCount: 1,
    multiple: false,
    accept: "application/pdf,application/msword, .doc, .docx, .pdf",
    beforeUpload(file) {
      // Kiểm tra file type và size
      const isValidType =
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isValidType) {
        message.error("Chỉ hỗ trợ file PDF, DOC, DOCX!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File phải nhỏ hơn 5MB!");
        return Upload.LIST_IGNORE;
      }
      // Lưu file vào state, không upload ngay
      setFileCV(file);
      message.success(`${file.name} đã được chọn`);
      return false; // Ngăn không cho upload tự động
    },
    onRemove() {
      setFileCV(null);
      setUrlCV("");
    },
  };

  return (
    <>
      <Modal
        title='Ứng Tuyển Job'
        open={isModalOpen}
        onOk={() => handleOkButton()}
        onCancel={() => {
          setIsModalOpen(false);
          setFileCV(null);
          setUrlCV("");
        }}
        maskClosable={false}
        okText={isAuthenticated ? "Rải CV Nào " : "Đăng Nhập Nhanh"}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose={true}
        confirmLoading={isUploading}
      >
        <Divider />
        {isAuthenticated ? (
          <div>
            <ConfigProvider locale={enUS}>
              <ProForm
                submitter={{
                  render: () => <></>,
                }}
              >
                <Row gutter={[10, 10]}>
                  <Col span={24}>
                    <div>
                      Bạn đang ứng tuyển công việc <b>{jobDetail?.name} </b>tại <b>{jobDetail?.company?.name}</b>
                    </div>
                  </Col>
                  <Col span={24}>
                    <ProFormText
                      fieldProps={{
                        type: "email",
                      }}
                      label='Email'
                      name={"email"}
                      labelAlign='right'
                      disabled
                      initialValue={user?.email}
                    />
                  </Col>
                  <Col span={24}>
                    <ProForm.Item
                      label={"Upload file CV"}
                      rules={[{ required: true, message: "Vui lòng upload file!" }]}
                    >
                      <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>
                          Tải lên CV của bạn ( Hỗ trợ *.doc, *.docx, *.pdf, and &lt; 5MB )
                        </Button>
                      </Upload>
                    </ProForm.Item>
                  </Col>
                </Row>
              </ProForm>
            </ConfigProvider>
          </div>
        ) : (
          <div>Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Rải CV" bạn nhé -.-</div>
        )}
        <Divider />
      </Modal>
    </>
  );
};
export default ApplyModal;
