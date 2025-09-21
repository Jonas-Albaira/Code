export const authInterceptor = (req, next) => {
    const token = localStorage.getItem('token');
    if (token) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next(req);
};
//# sourceMappingURL=auth.interceptor.js.map