import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/SdkConfig';

interface ApiErrorResponse {
    error_code: number;
    error_message: string;
    data: any | null;
}

export const handleApiError = (error: any) => {
    // Handle API errors
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        console.log('Axios Error:', axiosError.code);

        // Handle API response errors
        if (axiosError.response) {
            const { error_code } = axiosError.response.data || {};

            console.log('API Error Code:', error_code);
            const error_message = getApiError(error_code);
            console.log('API Error Message:', error_message);

            // Throw a structured error object
            return new Error(
                `${error_message}`
            );
        } else {
            // Handle network errors
            console.log('Network issue or no response from server.');
            return new Error('Network issue or no response from server.');
        }
    } else {
        // Handle other unexpected errors
        console.log('An unexpected error occurred:', error);
        return new Error('An unexpected error occurred.');
    }
}


export const defaultApiErrors: ApiError[] = [
    {
        error_code: 400,
        error_message_en: 'Make sure all the required parameters are included.',
        error_message_ar: 'تأكد من تضمين جميع المعلمات المطلوبة.',
    },
    {
        error_code: 401,
        error_message_en: 'Make sure you are using the correct credentials and try again.',
        error_message_ar: 'تأكد من أنك تستخدم بيانات الاعتماد الصحيحة وحاول مرة أخرى.',
    },
    {
        error_code: 403,
        error_message_en: 'Generate and include a valid access token and try again.',
        error_message_ar: 'قم بإنشاء وتضمين رمز وصول صالح وحاول مرة أخرى.',
    },
    {
        error_code: 415,
        error_message_en: 'Please re-check your image format.',
        error_message_ar: 'يرجى إعادة التحقق من تنسيق الصورة الخاصة بك.',
    },
    {
        error_code: 422,
        error_message_en: 'Check the custom error code returned in the response, and refer to the Vlens Error Codes table for more information.',
        error_message_ar: 'تحقق من رمز الخطأ المخصص الذي تم إرجاعه في الاستجابة، وارجع إلى جدول رموز الأخطاء في Vlens لمزيد من المعلومات.',
    },
    {
        error_code: 500,
        error_message_en: 'Well-formed request received, but an unexpected error has occurred. Try again later.',
        error_message_ar: 'تم استلام طلب منسق بشكل صحيح، ولكن حدث خطأ غير متوقع. حاول مرة أخرى لاحقًا.',
    },
    {
        error_code: 3001,
        error_message_en: 'Error, Please make sure the document is in a good lighting condition and well focused.',
        error_message_ar: 'خطأ، يرجى التأكد من أن المستند في إضاءة جيدة ومركز بشكل جيد.',
    },
    {
        error_code: 3002,
        error_message_en: 'Error, Please make sure the document is in a good lighting condition and well focused.',
        error_message_ar: 'خطأ، يرجى التأكد من أن المستند في إضاءة جيدة ومركز بشكل جيد.',
    },
    {
        error_code: 3003,
        error_message_en: 'Error, Please make sure the document is in a good lighting condition and well focused.',
        error_message_ar: 'خطأ، يرجى التأكد من أن المستند في إضاءة جيدة ومركز بشكل جيد.',
    },
    {
        error_code: 3004,
        error_message_en: 'Error, Please make sure the document is in a good lighting condition and well focused.',
        error_message_ar: 'خطأ، يرجى التأكد من أن المستند في إضاءة جيدة ومركز بشكل جيد.',
    },
    {
        error_code: 3005,
        error_message_en: 'Error, Please make sure the document is in a good lighting condition and well focused.',
        error_message_ar: 'خطأ، يرجى التأكد من أن المستند في إضاءة جيدة ومركز بشكل جيد.',
    },
    {
        error_code: 3006,
        error_message_en: 'Error, Please make sure the document is in a good lighting condition and well focused.',
        error_message_ar: 'خطأ، يرجى التأكد من أن المستند في إضاءة جيدة ومركز بشكل جيد.',
    },
    {
        error_code: 3007,
        error_message_en: 'Make sure dates in the ID are in correct format.',
        error_message_ar: 'تأكد من أن التواريخ في الهوية بالتنسيق الصحيح.',
    },
    {
        error_code: 3008,
        error_message_en: 'Make sure dates in the ID are in correct format.',
        error_message_ar: 'تأكد من أن التواريخ في الهوية بالتنسيق الصحيح.',
    },
    {
        error_code: 3009,
        error_message_en: 'Make sure dates in the ID are in correct format.',
        error_message_ar: 'تأكد من أن التواريخ في الهوية بالتنسيق الصحيح.',
    },
    {
        error_code: 3010,
        error_message_en: 'Make sure the expiry date of the submitted document has not passed.',
        error_message_ar: 'تأكد من أن تاريخ انتهاء صلاحية المستند المقدم لم ينقض.',
    },
    {
        error_code: 3011,
        error_message_en: 'Error, Please make sure the document is in a good lighting condition and well focused.',
        error_message_ar: 'خطأ، يرجى التأكد من أن المستند في إضاءة جيدة ومركز بشكل جيد.',
    },
    {
        error_code: 3013,
        error_message_en: 'Error, Please make sure the document is in a good lighting condition and well focused.',
        error_message_ar: 'خطأ، يرجى التأكد من أن المستند في إضاءة جيدة ومركز بشكل جيد.',
    },
    {
        error_code: 3101,
        error_message_en: 'ID number in ID front and back documents are not matched.',
        error_message_ar: 'رقم الهوية في المستندات الأمامية والخلفية للهوية غير متطابق.',
    },
    {
        error_code: 3102,
        error_message_en: 'Name in ID front and car license documents are not matched.',
        error_message_ar: 'الاسم في المستندات الأمامية للهوية ورخصة السيارة غير متطابق.',
    },
    {
        error_code: 4001,
        error_message_en: 'Please re-enter your bundle key correctly.',
        error_message_ar: 'يرجى إعادة إدخال مفتاح الحزمة الخاص بك بشكل صحيح.',
    },
    {
        error_code: 4002,
        error_message_en: 'Please recharge your bundle and try again.',
        error_message_ar: 'يرجى إعادة شحن حزمة الخاص بك وحاول مرة أخرى.',
    },
    {
        error_code: 4003,
        error_message_en: 'Number of trials exceeded the limit. Try again later.',
        error_message_ar: 'تجاوز عدد المحاولات الحد المسموح به. حاول مرة أخرى لاحقًا.',
    },
    {
        error_code: 4004,
        error_message_en: 'Make sure the service being called is registered in your bundle.',
        error_message_ar: 'تأكد من أن الخدمة التي يتم استدعاؤها مسجلة في حزمة الخاص بك.',
    },
    {
        error_code: 4005,
        error_message_en: 'The bundle has been disabled, please contact the server admin for re-activation.',
        error_message_ar: 'تم تعطيل الحزمة، يرجى الاتصال بمسؤول الخادم لإعادة التفعيل.',
    },
    {
        error_code: 4006,
        error_message_en: 'You are not subscribed to any bundle.',
        error_message_ar: 'أنت غير مشترك في أي حزمة.',
    },
    {
        error_code: 4007,
        error_message_en: 'Your subscription is expired, please renew your subscription.',
        error_message_ar: 'انتهت صلاحية اشتراكك، يرجى تجديد اشتراكك.',
    },
    {
        error_code: 4206,
        error_message_en: 'Please make sure to have only one face in the image.',
        error_message_ar: 'يرجى التأكد من وجود وجه واحد فقط في الصورة.',
    },
    {
        error_code: 4207,
        error_message_en: 'No Face detected',
        error_message_ar: 'لم يتم اكتشاف أي وجه',
    },
    {
        error_code: 4208,
        error_message_en: 'Please make sure that there is a face in the image.',
        error_message_ar: 'يرجى التأكد من وجود وجه في الصورة.',
    },
    {
        error_code: 4209,
        error_message_en: 'Please recapture your face and ensure the capture is clear.',
        error_message_ar: 'يرجى إعادة التقاط صورتك والتأكد من أن الصورة واضحة.',
    },
    {
        error_code: 4210,
        error_message_en: 'Please recapture your face and ensure the capture is clear.',
        error_message_ar: 'يرجى إعادة التقاط صورتك والتأكد من أن الصورة واضحة.',
    },
    {
        error_code: 5000,
        error_message_en: 'Something went wrong, please contact support',
        error_message_ar: 'حدث خطأ ما، يرجى الاتصال بالدعم',
    },
    {
        error_code: 5001,
        error_message_en: 'Please enter a supported document.',
        error_message_ar: 'يرجى إدخال مستند مدعوم.',
    },
    {
        error_code: 5002,
        error_message_en: 'Make sure each provided image does not exceed the 5MB limit.',
        error_message_ar: 'تأكد من أن كل صورة مقدمة لا تتجاوز الحد الأقصى 5 ميجابايت.',
    },
    {
        error_code: 5003,
        error_message_en: 'Make sure each provided image does not exceed the 25 Million pixel limit.',
        error_message_ar: 'تأكد من أن كل صورة مقدمة لا تتجاوز الحد الأقصى 25 مليون بكسل.',
    },
    {
        error_code: 5004,
        error_message_en: 'Check the Transaction ID/token sent in the request.',
        error_message_ar: 'تحقق من معرف المعاملة/الرمز المرسل في الطلب.',
    },
    {
        error_code: 5005,
        error_message_en: 'please make sure you\'re capturing a real document',
        error_message_ar: 'يرجى التأكد من أنك تلتقط مستندًا حقيقيًا',
    },
    {
        error_code: 5006,
        error_message_en: 'Please recapture image and make sure it is focused',
        error_message_ar: 'يرجى إعادة التقاط الصورة والتأكد من أنها واضحة',
    },
    {
        error_code: 5007,
        error_message_en: 'Document is supported but wrong end point was called',
        error_message_ar: 'المستند مدعوم ولكن تم استدعاء نقطة نهاية خاطئة',
    },
    {
        error_code: 5008,
        error_message_en: 'There was an issue assigning data to the correct fields.',
        error_message_ar: 'حدثت مشكلة في تعيين البيانات إلى الحقول الصحيحة.',
    },
    {
        error_code: 3014,
        error_message_en: 'The system could not detect a face in the ID image.',
        error_message_ar: 'لم يتمكن النظام من اكتشاف وجه في صورة الهوية.',
    },
    {
        error_code: 7000,
        error_message_en: 'A general error occurred while processing multiple cards.',
        error_message_ar: 'حدث خطأ عام أثناء معالجة بطاقات متعددة.',
    },
    {
        error_code: 7001,
        error_message_en: 'A general error occurred while processing the front side of the ID card.',
        error_message_ar: 'حدث خطأ عام أثناء معالجة الجانب الأمامي من بطاقة الهوية.',
    },
    {
        error_code: 7002,
        error_message_en: 'A general error occurred while processing the back side of the ID card.',
        error_message_ar: 'حدث خطأ عام أثناء معالجة الجانب الخلفي من بطاقة الهوية.',
    },
    {
        error_code: 7003,
        error_message_en: 'A general error occurred while processing the back side of the car license.',
        error_message_ar: 'حدث خطأ عام أثناء معالجة الجانب الخلفي من رخصة السيارة.',
    },
    {
        error_code: 7004,
        error_message_en: 'A general error occurred while processing the front side of the car license.',
        error_message_ar: 'حدث خطأ عام أثناء معالجة الجانب الأمامي من رخصة السيارة.',
    },
    {
        error_code: 7005,
        error_message_en: 'A general error occurred while processing the driving license.',
        error_message_ar: 'حدث خطأ عام أثناء معالجة رخصة القيادة.',
    },
    {
        error_code: 7006,
        error_message_en: 'A general error occurred while processing the passport.',
        error_message_ar: 'حدث خطأ عام أثناء معالجة جواز السفر.',
    },
    {
        error_code: 7008,
        error_message_en: 'A general error occurred while matching the face image.',
        error_message_ar: 'حدث خطأ عام أثناء مطابقة صورة الوجه.',
    },
];
 
export const getApiError = (errorCode: number, errorsData: ApiError[] = defaultApiErrors): string => {
    let errorItem = errorsData.find((error) => error.error_code === errorCode);
    return errorItem ? errorItem.error_message_en : 'An unknown error occurred.';
}