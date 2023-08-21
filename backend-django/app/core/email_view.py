from django.core.mail import send_mail
from rest_framework.decorators import (
    api_view,
    renderer_classes,
)
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from django.conf import settings
import pymysql


def create_conn():
    return pymysql.connect(
        host=settings.EXOMICS_DB_HOST,
        port=settings.EXOMICS_DB_PORT,
        user=settings.EXOMICS_DB_USER,
        password=settings.EXOMICS_DB_PASSWORD,
        database=settings.EXOMICS_DB_NAME,
    )


@api_view(['POST'])
@renderer_classes([JSONRenderer])
def data_request_email_view(request):
    """
    Receive form data and send email.
    """
    title = request.data.get('title')
    first_name = request.data.get('firstName')
    last_name = request.data.get('lastName')
    email = request.data.get('email')
    affiliation = request.data.get('affiliation')
    purpose = request.data.get('purpose')

    name = first_name + ' ' + last_name
    if title:
        name = title + ' ' + name
    subject = f'cfOmics Data Download Link'

    message = f'Dear {name}\n\n'
    message += f'Please go to\n'
    message += f'http://111.198.139.65/cfomics-static/\n'
    message += f'for downloading our data.\n\n'

    sender = settings.EMAIL_HOST_USER
    recipients = settings.EMAIL_RECIPIENTS + [email]
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=sender,
            recipient_list=recipients,
            fail_silently=False,
        )
        with create_conn() as conn:
            with conn.cursor() as cursor:
                sql = 'INSERT INTO `request_list` '\
                    '(`title`, `first_name`, `last_name`, `email`, `affiliation`, `purpose`, `time`) '\
                    f'VALUES (\'{title or "N/A"}\', \'{first_name}\', \'{last_name}\', '\
                    f'\'{email}\', \'{affiliation}\', \'{purpose}\', NOW());'
                cursor.execute(sql)
            conn.commit()
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            data={ 'detail': str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['GET'])
def get_request_list_view(request):
    """Get records in the request_list table."""
    token = request.headers.get('Authorization')
    if token != settings.ADMIN_AUTH_TOKEN:
        return Response(
            data={ 'detail': 'Invalid auth token' },
            status=status.HTTP_401_UNAUTHORIZED,
            content_type='application/json',
        )
    conn = create_conn()
    try:
        with create_conn() as conn:
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = 'SELECT * FROM `request_list` ORDER BY `time` DESC;'
                cursor.execute(sql)
                result = cursor.fetchall()
        return Response(data=result, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )
