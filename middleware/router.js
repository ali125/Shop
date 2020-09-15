
const viewType = (view = null) => {
    return (req, res, next) => {
        req.viewPath = view;
        next();
    };
};
const renderView = (req, res, props) => {
    const redirect = props.redirect || null;
    const view = req.viewPath || null;
    const status = props.status || 200;
    delete props.status;
    if(view) {
        if(redirect) return res.redirect(redirect);
        return res.status(status).render(view, props);
    } else {
        return res.status(status).send(props);
    }
};
const renderViewError = (req, res, props) => {
    const view = req.viewPath || null;
    const message = props.errors.toString() || {};
    const status = props.status || 500;

    if(view) {
        // return res.status(status).send({ errors });
        // return res.send(props.errors);
        return res.render('error', { error: { status }, message });
    } else {
        return res.status(status).send({ error: { status }, message });
    }
};

module.exports = {
    viewType,
    renderView,
    renderViewError,
};
