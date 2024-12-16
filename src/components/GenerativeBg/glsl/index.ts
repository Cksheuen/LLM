import moonFragmentShaderUrl from './moon/frag.glsl'
import moonVertexShaderUrl from './moon/vert.glsl'
import terrainFragmentShaderUrl from './terrain/frag.glsl'
import terrainVertexShaderUrl from './terrain/vert.glsl'

interface ShaderSource {
    vertex: string,
    fragment: string
}

interface ShaderSourceUrl {
    [key: string]: ShaderSource
}


const shaderSourceUrl: ShaderSourceUrl = {
    moon: {
        vertex: moonVertexShaderUrl,
        fragment: moonFragmentShaderUrl
    },
    terrain: {
        vertex: terrainVertexShaderUrl,
        fragment: terrainFragmentShaderUrl
    }
}
export default shaderSourceUrl;