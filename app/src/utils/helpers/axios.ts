export const checkRequestSuccess = (response: any) => {
    return response?.statusCode === 200 || response?.statusCode === 201
}

export const checkRequestInvalidToken = (response: any) => {
    return response?.statusCode === 401
}

export const checkRequestInvalidValidation = (response: any) => {
    return response?.statusCode === 422
}
