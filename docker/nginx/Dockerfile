FROM nginx:1.24.0 AS nginx

# front end 
ADD ./quize.tar.xz /usr/share/nginx/html

# cetificates excusive
COPY ./exclusive_damenyachting_com.crt /etc/ssl/exclusive_damenyachting_com.crt
COPY ./exclusive_damenyachting_com.key /etc/ssl/exclusive_damenyachting_com.key

# cetificates challenge
COPY ./challenge_damenyachting_com.crt /etc/ssl/challenge_damenyachting_com.crt
COPY ./challenge_damenyachting_com.key /etc/ssl/challenge_damenyachting_com.key


# configurations 
COPY ./nginx.conf /etc/nginx/conf.d/default.conf