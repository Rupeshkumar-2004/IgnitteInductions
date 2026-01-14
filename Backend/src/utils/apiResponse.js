class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data   // <--- learn more about this...
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }