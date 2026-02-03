import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
def send_email(recipient, otp, t):
    smtp_user = os.getenv('SMTP_USER')
    smtp_password = os.getenv('SMTP_PASS')
    smtp_host = os.getenv('SMTP_HOST')
    smtp_port = os.getenv('SMTP_PORT')
    print('port:', smtp_port)
    if not all([smtp_user, smtp_password, smtp_host, smtp_port]):
        print("Error: Missing SMTP configuration in environment variables")
        return
    sender = smtp_user
    subject = "Your OTP Code"
    if t == 1:   
        body = f"Your OTP code is: {otp}"
    else:
        body = f"Your passwordrest code is: {otp}"
    print('Body:', body)
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = recipient
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_host, int(smtp_port))
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())
        print("Success: Verification email sent")
        server.quit()
    except Exception as e:
        print(f"Error occurred while sending email: {str(e)}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python3 src/services/send_email.py <recipient> <otp> <t>")
        sys.exit(1)

    recipient = sys.argv[1]
    otp = sys.argv[2]

    send_email(recipient, otp)
