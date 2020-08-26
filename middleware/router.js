
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
    const errors = props.errors.toString() || {};
    if(view) {
        return res.status(500).send({ errors });
        // return res.send(props.errors);
        // return res.render(view, props);
    } else {
        return res.status(500).send({ errors });
    }
};

module.exports = {
    viewType,
    renderView,
    renderViewError,
};
