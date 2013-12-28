define(function() {

    var defaultShaderType = ["VERTEX_SHADER", "FRAGMENT_SHADER"];
    var browserPrefixes = ["", "MOZ_", "OP_", "WEBKIT_"];

    function enumToString(gl, value) {
        for (var p in gl) {
            if (gl[p] == value) {
                return p;
            }
        }
        return "0x" + value.toString(16);
    }

    function setupWebGL(canvas, params) {
        var context;
        try {
            context = canvas.getContext("webgl", params);
        } catch (e) {
            context = canvas.getContext("experimental-webgl", params);
        }

        return context;
    }

    function loadShader(gl, shaderSource, shaderType, errorCallback) {
        var errFn = errorCallback || error;

        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function loadProgram(gl, shaders, params, locations, errorCallback) {
        var errFn = errorCallback || error;
        var program = gl.createProgram();
        var i;
        for (i = 0; i < shaders.length; i++) {
            gl.attachShader(program, shaders[i]);
        }
        if (params) {
            for (i = 0; i < params.length; i++) {
                gl.bindAttribLocation(program, locations ? locations[i] : i, params[i]);
            }
        }
        gl.linkProgram(program);

        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    function createShaderFromScript(gl, scriptId, opt_shaderType, errorCallback) {
        var shaderSource = "";
        var shaderType;
        var shaderScript = document.getElementById(scriptId);
        if (!shaderScript) {
            throw "*** Error: unknown script element" + scriptId;
        }
        shaderSource = shaderScript.text;

        if (!opt_shaderType) {
            if (shaderScript.type == "x-shader/x-vertex") {
                shaderType = gl.VERTEX_SHADER;
            } else if (shaderScript.type == "x-shader/x-fragment") {
                shaderType = gl.FRAGMENT_SHADER;
            } else if (shaderType != gl.VERTEX_SHADER && shaderType != gl.FRAGMENT_SHADER) {
                throw "*** Error: unknown shader type";
            }
        }

        return loadShader(gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType, errorCallback);
    }



    function createProgramFromScripts(gl, shaderScriptIds, params, locations, errorCallback) {
        var shaders = [];
        for (var i = 0; i < shaderScriptIds.length; i++) {
            shaders.push(createShaderFromScript(gl, shaderScriptIds[i], gl[defaultShaderType[i]], errorCallback));
        }
        return loadProgram(gl, shaders, params, locations, errorCallback);
    }



    function getExtensionWithKnownPrefixes(gl, name) {
        for (var i = 0; i < browserPrefixes.length; i++) {
            var prefixedName = browserPrefixes[i] + name;
            var ext = gl.getExtension(prefixedName);
            if (ext) {
                return ext;
            }
        }
        return null;
    }

    function resizeCanvasToDisplaySize(canvas) {
        if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
    }

    return {
        enumToString: enumToString,
        setupWebGL: setupWebGL,
        loadShader: loadShader,
        loadProgram: loadProgram,
        createShaderFromScript: createShaderFromScript,
        createProgramFromScripts: createProgramFromScripts,
        getExtensionWithKnownPrefixes: getExtensionWithKnownPrefixes,
        resizeCanvasToDisplaySize: resizeCanvasToDisplaySize
    };

});
