exports.get404 = (req, res, next) => {
    res.status(404).render('page-not-found', {path:'' ,pageTitle: 'Page Not Found',isAuthenticated: req.session.isLoggedIn
    })
}

exports.get500 = (req, res, next) => {
    res.status(500).render('500', {path:'' ,pageTitle: 'Error!',isAuthenticated: req.session.isLoggedIn})
}