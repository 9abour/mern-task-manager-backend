interface IErrorHandlerArgs {
	message: string;
	code: number;
}

class AppError extends Error {
	public message: string;
	public code: number;

	constructor({ message, code }: IErrorHandlerArgs) {
		super();
		this.message = message;
		this.code = code;
	}

	createError({ message, code }: IErrorHandlerArgs) {
		this.message = message;
		this.code = code;
	}
}

export default AppError;
