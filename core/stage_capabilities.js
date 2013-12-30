define(function(require) {

    var glUtils = require("burst/utils/webgl_utils");

    return function(stage) {

        function createProgram(context) {
            var vertexShaderSource =
                "attribute vec3 aVertexPosition;                 \n" +
                "void main() {                                   \n" +
                "  gl_Position = vec4(aVertexPosition, 1.0);     \n" +
                "}                                               \n";

            var fragmentShaderSource =
                "precision mediump float;                    \n" +
                "void main() {                               \n" +
                "  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);  \n" +
                "}                                           \n";

            var vertexShader = loadShader(context, context.VERTEX_SHADER, vertexShaderSource);
            var fragmentShader = loadShader(context, context.FRAGMENT_SHADER, fragmentShaderSource);

            var shaderProgram = context.createProgram();
            context.attachShader(shaderProgram, vertexShader);
            context.attachShader(shaderProgram, fragmentShader);
            context.linkProgram(shaderProgram);

            if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
                alert("Failed to setup shaders");
            }

            context.useProgram(shaderProgram);

            shaderProgram.vertexPositionAttribute = context.getAttribLocation(shaderProgram, "aVertexPosition");

            return shaderProgram;
        }

        function loadShader(context, type, source) {
            var shader = context.createShader(type);
            context.shaderSource(shader, source);
            context.compileShader(shader);

            if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
                alert("Error compiling shader" + context.getShaderInfoLog(shader));
                context.deleteShader(shader);
                return null;
            }

            return shader;
        }

        function createBuffer(context) {
            var vertexBuffer = context.createBuffer();
            context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
            var triangleVertices = [
                0.0, 0.5, 0.0,
                -0.5, -0.5, 0.0,
                0.5, -0.5, 0.0
            ];
            context.bufferData(context.ARRAY_BUFFER, new Float32Array(triangleVertices), context.STATIC_DRAW);
            vertexBuffer.itemSize = 3;
            vertexBuffer.numberOfItems = 3;

            return vertexBuffer;
        }

        function draw(context, program, buffer) {
            context.viewport(0, 0, context.viewportWidth, context.viewportHeight);
            context.clear(context.COLOR_BUFFER_BIT);

            context.vertexAttribPointer(program.vertexPositionAttribute, buffer.itemSize, context.FLOAT, false, 0, 0);
            context.enableVertexAttribArray(program.vertexPositionAttribute);
            context.drawArrays(context.TRIANGLES, 0, buffer.numberOfItems);
        }

        stage.setupRenderer = function(canvas) {
            var context = glUtils.getContext(canvas);
            context.viewportWidth = canvas.width;
            context.viewportHeight = canvas.height;

            var program = createProgram(context);
            var buffer = createBuffer(context);
            context.clearColor(0.0, 0.0, 0.0, 1.0);
            draw(context, program, buffer);
        };

        return stage;

    };

});
