import moonFragmentShaderUrl from './moon/frag.glsl?raw'
import moonVertexShaderUrl from './moon/vert.glsl?raw'
import terrainFragmentShaderUrl from './terrain/frag.glsl?raw'
import terrainVertexShaderUrl from './terrain/vert.glsl?raw'

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