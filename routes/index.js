'use strict';

function defineRoutes(server) {
    server.get("/face", function(req,res,next){
        res.send(200, "FACE");
        return next();
    });

}

module.exports = defineRoutes;