FROM ubuntu:22.04

ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY ./requirements.txt ./
RUN apt update && apt install git python3 python3-pip -y
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8085

CMD ["/bin/bash", "-c", "python3 /app/app/manage.py migrate && python3 /app/app/manage.py runserver 0.0.0.0:8085"]
