exports.get404 = (req, res, next) => {
    res.status(404).render('page-not-found', {path:'' ,pageTitle: 'Page Not Found',isAuthenticated: req.session.isLoggedIn
    })
}