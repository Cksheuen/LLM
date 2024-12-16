import { useRef, useEffect } from "react";
import shaderSourceUrl from './glsl'

interface Position {
    x: number
    y: number
}

interface GenerativeBgParams {
    type: string
    content?: string
    pos: Position
    angle: number
    imgData: string
    show?: boolean
}


/**
 * 
 * @param {string} content - 显示的文字
 * @param {Position} pos - 任意传入数值，作为地形生成水平方向的坐标
 * @param {number} angle - 任意传入数值，作为相机生成的角度
 * @param {string} type - 固定 type，分别对应不同内容生成
 * @returns 
 */
export default function GenerativeBg({
    content, pos, angle, type, imgData, show
}: GenerativeBgParams) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const container = useRef<HTMLDivElement>(null);
    const program = useRef<WebGLProgram | null>(null)
    let animationTime = Date.now()

    let animationFrameId = useRef<number | null>(null)

    const startTime = useRef(Date.now())

    function setShaderToyUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
        const iResolutionLocation = gl.getUniformLocation(program, 'iResolution')
        const iTimeLocation = gl.getUniformLocation(program, 'iTime')
        const iTimeDeltaLocation = gl.getUniformLocation(program, 'iTimeDelta')
        const iFrameRateLocation = gl.getUniformLocation(program, 'iFrameRate')
        const iFrameLocation = gl.getUniformLocation(program, 'iFrame')
        const iChannelTimeLocation = gl.getUniformLocation(program, 'iChannelTime')
        const iChannelResolutionLocation = gl.getUniformLocation(program, 'iChannelResolution')
        const iMouseLocation = gl.getUniformLocation(program, 'iMouse')
        const iDateLocation = gl.getUniformLocation(program, 'iDate')
        const iSampleRateLocation = gl.getUniformLocation(program, 'iSampleRate')
        const iPosLocation = gl.getUniformLocation(program, 'iPos')
        const iAngleLocation = gl.getUniformLocation(program, 'iAngle')
        const iShowLocation = gl.getUniformLocation(program, 'iShow')
        const iAnimationTimeLocation = gl.getUniformLocation(program, 'iAnimationTime')

        let lastTime = startTime.current
        let frame = 0
        function render() {
            const currentTime = Date.now()
            const time = (currentTime - startTime.current) / 1000
            const timeDelta = (currentTime - lastTime) / 1000
            const frameRate = 1 / timeDelta

            gl.uniform3f(iResolutionLocation, gl.canvas.width, gl.canvas.height, 1.0)
            gl.uniform1f(iTimeLocation, time)
            gl.uniform1f(iTimeDeltaLocation, timeDelta)
            gl.uniform1f(iFrameRateLocation, frameRate)
            gl.uniform1i(iFrameLocation, frame)
            gl.uniform1fv(iChannelTimeLocation, new Float32Array([time, time, time, time]))
            gl.uniform3fv(iChannelResolutionLocation, new Float32Array([
                gl.canvas.width,
                gl.canvas.height,
                1.0,
                gl.canvas.width,
                gl.canvas.height,
                1.0,
                gl.canvas.width,
                gl.canvas.height,
                1.0,
                gl.canvas.width,
                gl.canvas.height,
                1.0,
            ]))
            gl.uniform4f(iMouseLocation, 0, 0, 0, 0) // Update with actual mouse coordinates if needed
            gl.uniform4f(iDateLocation, 2023, 10, 1, time) // Update with actual date if needed
            gl.uniform1f(iSampleRateLocation, 44100.0)
            gl.uniform2f(iPosLocation, pos.x, pos.y)
            gl.uniform1f(iAngleLocation, angle)
            gl.uniform1f(iShowLocation, show ? 1.0 : -1.0)
            gl.uniform1f(iAnimationTimeLocation, (currentTime - animationTime) / 1000)

            lastTime = currentTime
            frame++

            gl.clear(gl.COLOR_BUFFER_BIT)

            const positionLocation = gl.getAttribLocation(program, 'a_position')
            const positionBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1,
                -1,
                1,
                -1,
                -1,
                1,
                1,
                1,
            ]), gl.STATIC_DRAW)

            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

            if (type === 'moon')
                animationFrameId.current = requestAnimationFrame(render)
        }
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId.current!)
        }
        render()
    }

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;

        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        return program;
    }
    async function init() {
        const vertexShaderScouce = await fetch(shaderSourceUrl[type].vertex).then(res => res.text())
        const fragmentShaderScouce = await fetch(shaderSourceUrl[type].fragment).then(res => res.text())

        canvasRef.current!.width = container.current!.clientWidth
        canvasRef.current!.height = container.current!.clientHeight

        const gl = canvasRef.current?.getContext('webgl');

        if (!gl) {
            console.log('webgl not supported');
            return;
        }
        const program = createProgram(gl, vertexShaderScouce!, fragmentShaderScouce!);

        gl.useProgram(program);
        setNewProgram(program)
        generateTexture()
        // setShaderToyUniforms(gl, program);
    }

    function setNewProgram(new_program: WebGLProgram) {
        program.current = new_program
    }

    function generateTexture() {
        const canvas = canvasRef.current
        canvas!.width = container.current!.clientWidth
        canvas!.height = container.current!.clientHeight

        const gl = canvas?.getContext('webgl');

        const img = new Image()

        if (content) {
            const fonts_canvas = document.createElement('canvas')
            fonts_canvas.width = container.current!.clientWidth
            fonts_canvas.height = container.current!.clientHeight
            fonts_canvas.style.position = 'absolute'

            const ctx = fonts_canvas.getContext('2d')!
            ctx.fillStyle = 'black'
            ctx.font = `${container.current!.clientWidth / 10}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(content, container.current!.clientWidth / 2, container.current!.clientHeight / 2)

            let fonts_img = fonts_canvas.toDataURL("image/png", 1.0)

            img.src = fonts_img
        } else if (imgData) {
            img.src = imgData
        } else {
            if (!gl) {
                console.log('webgl not supported');
                return;
            }
            if (program.current === null) {
                console.log('program not created');
                return;
            }

            setShaderToyUniforms(gl, program.current);
            return
        }

        img.onload = function () {
            // canvasRef.current!.parentElement!.appendChild(img)

            if (!gl) {
                console.log('webgl not supported');
                return;
            }
            if (program.current === null) {
                console.log('program not created');
                return;
            }
            const textureLocation = gl.getUniformLocation(program.current!, 'u_texture')
            const texture = gl.createTexture()!
            if (!texture) {
                console.log('texture not created');
                return;
            }
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, texture)

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            // 生成 mipmap（可选）
            gl.generateMipmap(gl.TEXTURE_2D);

            // 将纹理单元索引传递给着色器中的 uniform
            gl.uniform1i(textureLocation, 0);

            setShaderToyUniforms(gl, program.current);
        }

    }
    useEffect(() => {
        init()

        window.addEventListener('resize', () => {
            const gl = canvasRef.current?.getContext('webgl');
            if (!gl) {
                console.log('webgl not supported');
                return;
            }
            canvasRef.current!.width = container.current!.clientWidth
            canvasRef.current!.height = container.current!.clientHeight
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
            generateTexture()
        })
    })

    useEffect(() => {
        animationTime = Date.now()
        generateTexture()
    }, [imgData])

    useEffect(() => {
        const canvas = canvasRef.current
        const gl = canvas?.getContext('webgl');

        if (!gl) {
            console.log('webgl not supported');
            return;
        }
        if (program.current === null) {
            console.log('program not created');
            return;
        }
        setShaderToyUniforms(gl, program.current);
    }, [show])

    return (
        <div className="relative w-full h-full" ref={container}>
            <canvas className="absolute" ref={canvasRef} />
        </div>
    )
}