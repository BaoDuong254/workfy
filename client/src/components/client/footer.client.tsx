import styles from "@/styles/footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.title}>Job Portal Platform</div>

      <div className={styles.links}>
        <span>Privacy Policy</span>
        <span className={styles.separator}>|</span>
        <span>Terms of Service</span>
        <span className={styles.separator}>|</span>
        <span>Contact Us</span>
      </div>

      <div className={styles.copyright}>&copy; 2025 Job Portal. All rights reserved. Built with React & NestJS</div>
    </footer>
  );
};

export default Footer;
