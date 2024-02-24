exports.get404 = (req, res, next) => {
    res.status(404).render('page-not-found', {
        path: '/404',
        pageTitle: 'Page Not Found',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.get500 = (req, res, next) => {
    console.log("Reached get 500 with req", req)
    res.status(500).render('500', {
        path: '',
        pageTitle: 'Error!',
        isAuthenticated: req.session.isLoggedIn
    })
}