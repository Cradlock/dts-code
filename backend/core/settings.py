

from pathlib import Path
from dotenv import load_dotenv
import os
from datetime import timedelta
from urllib.parse import urlparse
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
import dj_database_url

load_dotenv()


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

GOOGLE_SECRET_KEY = os.getenv("GOOGLE_SECRET_KEY")
GOOGLE_PUBLIC_ID = os.getenv("GOOGLE_PUBLIC_ID")

GOOGLE_OWNER = os.getenv("GOOGLE_OWNER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = os.getenv("EMAIL_PORT")
EMAIL_USE_TLC = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

FRONTEND_URL = os.getenv("FRONTEND_URL")

FRONT = FRONTEND_URL.split(",")[0].strip()

HOST = "https://api.shop-dts.org"
# Application definition

ALLOWED_HOSTS = [
    '176.126.164.152', 'localhost', '127.0.0.1', 'shop-dts.org','api.shop-dts.org'
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'catalog',
    'custom_auth',
    'worker',

    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google", 
    "dj_rest_auth",
    "dj_rest_auth.registration",
]

AUTH_USER_MODEL = 'custom_auth.Profile'

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'core.urls'


CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

# Добавляем локальные порты разработки
LOCALHOSTS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]



CORS_ALLOWED_ORIGINS = FRONTEND_URL.split(',')

CORS_ALLOW_ALL_ORIGINS += LOCALHOSTS

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ["templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST'),
        'PORT': os.getenv('POSTGRES_PORT', 5432),
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CSRF_COOKIE_HTTPONLY = False  
CSRF_COOKIE_SECURE = True     
CSRF_TRUSTED_ORIGINS = FRONTEND_URL.split(",")



# Объединяем
CSRF_TRUSTED_ORIGINS += LOCALHOSTS


SESSION_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SAMESITE = "None"

SESSION_COOKIE_SECURE = True  # только HTTPS
CSRF_COOKIE_SECURE = True
JWT_AUTH_COOKIE_SECURE = True
JWT_AUTH_REFRESH_COOKIE_SECURE = True

SESSION_COOKIE_HTTPONLY = True

SOCIALACCOUNT_PROVIDERS = {
    "google":{
        "APP": {
            "client_id":os.getenv("GOOGLE_PUBLIC_ID"),
            "secret":os.getenv("GOOGLE_SECRET_KEY"),
            "key":""
        },
        "SCOPE": [
            "profile",
            "email"
        ],
        "AUTH_PARAMS": {
            "access_type":"offline"
        }

    }
}


ACCOUNT_LOGIN_METHODS = {'email', 'username'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']

AUTH_PASSWORD_VALIDATORS = []

REST_USE_JWT = True

# Включаем cookie
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Название cookie
JWT_AUTH_COOKIE = 'access_token'       # имя cookie
JWT_AUTH_COOKIE_SECURE = False         # True для https
JWT_AUTH_COOKIE_HTTPONLY = True        # запрещает JS доступ
JWT_AUTH_COOKIE_PATH = '/'  


AUTHENTICATION_BACKENDS = [
    "custom_auth.views.UsernameOrEmailBackend",  # наш кастомный
    "django.contrib.auth.backends.ModelBackend",    # стандартный
]



REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}