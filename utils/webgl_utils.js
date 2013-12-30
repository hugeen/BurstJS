define(function() {

    var webglUtils = {};

    webglUtils.getContext = function(canvas) {
        return canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    };

    webglUtils.loadShader = function(context, source, type) {
        var shader = context.createShader(shaderType);
        context.shaderSource(shader, shaderSource);
        context.compileShader(shader);

        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            context.deleteShader(shader);
            return null;
        }

        return shader;
    };

    webglUtils.loadProgram = function(context, shaders, params, locations) {
        var program = gl.createProgram();

        shaders.forEach(function(shader) {
            context.attachShader(program, shader);
        });

        if (params) {
            for (var i = 0; i < params.length; i++) {
                context.bindAttribLocation(program, locations ? locations[i] : i, params[i]);
            }
        }
        context.linkProgram(program);

        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            context.deleteProgram(program);
            return null;
        }

        return program;
    };

    webglUtils.getShaderScript = function(context, element) {
        return {
            type: element.type === "x-shader/x-vertex" ? context.VERTEX_SHADER : context.FRAGMENT_SHADER,
            source: element.text
        };
    };

    webglUtils.resizeCanvasToDisplaySize = function(canvas) {
        if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
    };

    return webglUtils;

});
