precision mediump float;

uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrameRate;
uniform int iFrame;
uniform float iChannelTime[4];
uniform vec3 iChannelResolution[4];
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec4 iDate;
uniform float iSampleRate;
uniform sampler2D u_texture;
uniform vec2 iPos;
uniform float iAngle;

const vec3 sun_ray = vec3(0., 10., 0.);

float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define OCTAVES 4
float fbm(in vec2 st) {
  // Initial values
  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;
  //
  // Loop of octaves
  for (int i = 0; i < OCTAVES; i++) {
    value += amplitude * noise(st);
    st *= 2.;
    amplitude *= .5;
  }
  return value;
}

float cubicSmoothStep(float edge0, float edge1, float x) {
  // Normalize x to the range [0, 1]
  x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  // Apply a cubic curve to smooth the transition
  return x * x * (3.0 - 2.0 * x);
}

float doModel(vec3 p) {
  float fbm_num = fbm(p.xz);

  float floor = p.y - fbm_num;

  float cloud_height = 1.;
  float cloud_thickness =
      (cubicSmoothStep(.4, 1.1, fbm(p.xz + fbm(p.xz + fbm_num))) - .1) * .3;

  float clouds = max(p.y - cloud_height - cloud_thickness,
                     cloud_height - cloud_thickness - p.y);

  return floor;
  return min(floor, clouds);
}

void doCamera(out vec3 camPos, out vec3 camTar, in float time) {
  float an = iAngle;  // 让摄像机随时间旋转
  float radius = 1.0; // 摄像机到目标的距离
  float height = fbm(iPos) + .2;
  vec2 target = iPos + vec2(cos(an), sin(an)) * radius;
  camPos = vec3(iPos.x, height, iPos.y);          // 调整摄像机位置
  camTar = vec3(target.x, fbm(target), target.y); // 目标位置保持不变
}

vec3 doBackground(void) {
  float sun = dot(normalize(vec3(0.6, 0.7, 0.8)), normalize(sun_ray));
  return vec3(0.3, 0.4, 0.5) * (0.5 + 0.5 * sun);
}

// more info: https://iquilezles.org/articles/normalsSDF/
vec3 compute_normal(in vec3 pos) {
  const float eps = 0.002; // precision of the normal computation
  const vec3 v1 = vec3(1.0, -1.0, -1.0);
  const vec3 v2 = vec3(-1.0, -1.0, 1.0);
  const vec3 v3 = vec3(-1.0, 1.0, -1.0);
  const vec3 v4 = vec3(1.0, 1.0, 1.0);
  return normalize(v1 * doModel(pos + v1 * eps) + v2 * doModel(pos + v2 * eps) +
                   v3 * doModel(pos + v3 * eps) + v4 * doModel(pos + v4 * eps));
}

float intersect(in vec3 ro, in vec3 rd) {
  const float maxd = 20.0;
  float t = 0.0;
  for (int i = 0; i < 128; i++) // max number of raymarching iterations is 90
  {
    float d = doModel(ro + rd * t);
    if (d < 0.001 || t > maxd)
      break; // precision 0.001, maximum distance 20
    t += d;
  }
  return (t < maxd) ? t : -1.0;
}

vec3 color(in vec2 uv, out float depth) {
  // camera movement (ro is ray origin, ta is the target location we are looking
  // at)
  vec3 ro, ta;
  doCamera(ro, ta, 0.);

  // camera matrix
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = normalize(cross(uu, ww));
  mat3 camMat = mat3(uu, vv, ww);

  // create ray
  vec3 rd = normalize(camMat * vec3(uv, 2.0)); // 2.0 is the lens length

  // compute background
  vec3 col = doBackground();

  // project/intersect through raymarching of SDFs
  float t = intersect(ro, rd);
  if (t > -0.5) {
    // geometry
    vec3 pos = ro + t * rd;

    vec2 st = pos.xz;

    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm(st);
    q.y = fbm(st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2));
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8));

    float f = fbm(st + r);

    color =
        mix(vec3(0.101961, 0.619608, 0.666667),
            vec3(0.666667, 0.666667, 0.498039), clamp((f * f) * 4.0, 0.0, 1.0));

    color = mix(color, vec3(0, 0, 0.164706), clamp(length(q), 0.0, 1.0));

    color = mix(color, vec3(0.666667, 1, 1), clamp(length(r.x), 0.0, 1.0));

    vec3 final_col = vec3((f * f * f + .6 * f * f + .5 * f) * color);

    col = mix(col, final_col, 0.5);
    col = pow(clamp(col, 0.0, 1.0), vec3(0.4545));
  } else {
    col = vec3(1.);
  }

  depth = t;
  return col;
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
  vec2 st = gl_FragCoord.xy / iResolution.xy;
  st += fbm(st + iPos) / 10.;

  vec4 font = texture2D(u_texture, vec2(st.x, 1. - st.y));
  float depth;
  vec3 col = mix(color(uv, depth), font.xyz, .5);
  gl_FragColor = vec4(col, 1. - smoothstep(0., 10., depth) - font.a / 2.);
}
