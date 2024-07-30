from email.message import EmailMessage
from smtplib import SMTP

from jinja2 import Environment, PackageLoader, select_autoescape

from app.config import settings


def render_template(template_name: str, context: dict):
    env = Environment(loader=PackageLoader("app"), autoescape=select_autoescape())
    template = env.get_template(template_name)
    return template.render(context)


def send_mail(from_addr: str, to_addr: str, subject: str, html_content: str):
    msg = EmailMessage()
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg["Subject"] = subject
    msg.set_type("text/html")
    msg.set_content(html_content)

    with SMTP(settings.smtp_host, settings.smtp_port) as smtp:
        smtp.starttls()
        smtp.login(settings.smtp_user, settings.smtp_password)

        smtp.send_message(msg)
