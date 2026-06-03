(function () {
  var VS = '#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}';

  var FS = '#version 300 es\n' +
    'precision highp float;\n' +
    'out vec4 O;\n' +
    'uniform float time;\n' +
    'uniform vec2 resolution;\n' +
    'uniform vec3 u_color;\n' +
    '#define FC gl_FragCoord.xy\n' +
    '#define R resolution\n' +
    '#define T (time+660.)\n' +
    'float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}\n' +
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}\n' +
    'float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}\n' +
    'void main(){\n' +
    '  vec2 uv=(FC-.5*R)/R.y;\n' +
    '  vec3 col=vec3(1);\n' +
    '  uv.x+=.25;\n' +
    '  uv*=vec2(2,1);\n' +
    '  float n=fbm(uv*.28-vec2(T*.01,0));\n' +
    '  n=noise(uv*3.+n*2.);\n' +
    '  col.r-=fbm(uv+vec2(0,T*.015)+n);\n' +
    '  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);\n' +
    '  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);\n' +
    '  col=mix(col,u_color,dot(col,vec3(.21,.71,.07)));\n' +
    '  col=mix(vec3(.08),col,min(time*.1,1.));\n' +
    '  col=clamp(col,.08,1.);\n' +
    '  O=vec4(col,1);\n' +
    '}';

  function initSmokeShader(canvasId, sectionId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var gl = canvas.getContext('webgl2');
    if (!gl) { canvas.style.display = 'none'; return; }

    function mkShader(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh); return null;
      }
      return sh;
    }

    var vs = mkShader(gl.VERTEX_SHADER, VS);
    var fs = mkShader(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog)); return;
    }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var uRes   = gl.getUniformLocation(prog, 'resolution');
    var uTime  = gl.getUniformLocation(prog, 'time');
    var uColor = gl.getUniformLocation(prog, 'u_color');

    var color = [0.0, 0.0, 0.0];
    var t0 = performance.now();

    function resize() {
      var section = document.getElementById(sectionId);
      if (!section) return;
      var dpr = Math.max(1, window.devicePixelRatio || 1);
      var w = section.offsetWidth, h = section.offsetHeight;
      canvas.width  = w * dpr; canvas.height = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    function render() {
      var now = (performance.now() - t0) * 0.001;
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now);
      gl.uniform3fv(uColor, color);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  window.initSmokeShader = initSmokeShader;
})();
