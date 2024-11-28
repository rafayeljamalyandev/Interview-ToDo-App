export function statusOK(code: number, data: any) {
    return {
        meta: {
            code: code ? code : 200,
            msg: 'success',
        },
        data: data,
    };
}

export function statusError(code: number, msg: string, err: any) {
    return {
        meta: {
            code: code,
            msg: msg,
        },
        error: err,
    };
}
