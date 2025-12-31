export const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_centerForce; // 0.0 = Standard Flow, 1.0 = Singularity Mode
  uniform float u_complexity; // Controls FBM octaves (1.0 - 8.0)
  
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform vec3 u_color4;

  float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    f = f * f * (3.0 - 2.0 * f);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // FBM with variable octaves based on complexity uniform
  float fbm(in vec2 st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    
    // Loop up to max potential octaves (8)
    for (int i = 0; i < 8; i++) {
      // Smoothly fade out octaves based on complexity setting
      // e.g., if complexity is 3.5, octave 3 is full, octave 4 is half strength
      float weight = smoothstep(0.0, 1.0, u_complexity - float(i));
      
      if (weight > 0.0) {
        v += a * noise(st) * weight;
      }
      
      st = rot * st * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    st.x *= aspect;

    vec2 mouse = u_mouse / u_resolution.xy;
    mouse.x *= aspect;
    
    // Base mechanics
    float t_flow = u_time * 0.1;
    float t_pulse = sin(u_time * 0.5) * 0.02;

    // --- Dynamics Mode Logic ---
    vec2 center = vec2(0.5 * aspect, 0.5);
    vec2 dir = st - center;
    float distCenter = length(dir);

    if (u_centerForce > 0.5) {
      // SINGULARITY MODE: Spiral of Waves
      
      // 1. Spiral Rotation
      float twist = distCenter * 10.0 - u_time * 0.8;
      float s = sin(twist);
      float c = cos(twist);
      mat2 rot = mat2(c, -s, s, c);
      
      st = center + rot * dir;
      
      // 2. Wave Ripples
      float wave = sin(distCenter * 25.0 - u_time * 2.5);
      st += normalize(dir + 0.0001) * wave * 0.03;
      
    } else {
      // STANDARD MODE: Vertical Levitation
      st.y -= t_flow * 0.2; 
    }

    // --- Mouse Interaction ---
    vec2 d = st - mouse;
    float dist = length(d);
    float influence = smoothstep(0.6, 0.0, dist);
    vec2 distortion = d * influence * 1.5 + vec2(influence * sin(u_time * 2.0) * 0.05);

    // --- Deep Domain Warping ---
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.01 * t_flow + distortion );
    q.y = fbm( st + vec2(1.0) + distortion );

    vec2 r = vec2(0.);
    r.x = fbm( st + 4.0*q + vec2(1.7,9.2) + 0.15*t_flow + t_pulse );
    r.y = fbm( st + 4.0*q + vec2(8.3,2.8) + 0.126*t_flow );

    float f = fbm(st + r);
    
    // Viscous Sharpening
    f = f * f * (3.0 - 2.0 * f);
    f = pow(f, 1.3); 

    // --- Coloring ---
    vec3 color = mix(u_color1, u_color2, smoothstep(0.0, 0.4, f));
    color = mix(color, u_color3, smoothstep(0.3, 0.8, f));
    
    float detail = length(r);
    float highlight = smoothstep(0.7, 1.0, f) * smoothstep(0.0, 1.0, detail);
    color = mix(color, u_color4, highlight * 0.8);

    float shadow = 1.0 - smoothstep(0.0, 2.5, detail);
    color *= 0.8 + 0.2 * shadow;
    
    // Vignette
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv *=  1.0 - uv.yx;   
    float vig = uv.x*uv.y * 15.0; 
    vig = pow(vig, 0.2);
    color *= vig;
    
    color = pow(color, vec3(0.95)); 

    gl_FragColor = vec4(color, 1.0);
  }
`;
