import React, { useEffect, useRef, useState } from 'react';
import { Controls } from './Controls';
import { PRESETS } from '../constants/presets';
import { Preset } from '../types';
import { vertexShaderSource, fragmentShaderSource } from '../shaders/crimson';
import { createShader, createProgram, hexToRgb } from '../utils/webgl';
import { ResolutionDialog } from './ResolutionDialog';

/**
 * CrimsonShader
 * 
 * A WebGL-based procedural background component with customizable color palettes.
 * It uses Fragment Shaders to generate "organic flowing shapes" using Domain Warping techniques (FBM).
 */
export const CrimsonShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePreset, setActivePreset] = useState<string>(PRESETS[0].name);
  const [colors, setColors] = useState<string[]>(PRESETS[0].colors);
  const [centerForce, setCenterForce] = useState<boolean>(false);
  const [complexity, setComplexity] = useState<number>(6.0);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const isPlayingRef = useRef(true);
  const timeRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // WebGL context and uniform locations stored in refs to access during export
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformLocsRef = useRef<any>({});

  // We use a ref to pass the current colors and state to the WebGL render loop 
  const colorsRef = useRef(colors);
  const centerForceRef = useRef(centerForce);
  const complexityRef = useRef(complexity);

  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  useEffect(() => {
    centerForceRef.current = centerForce;
  }, [centerForce]);

  useEffect(() => {
    complexityRef.current = complexity;
  }, [complexity]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) {
      lastTimeRef.current = Date.now();
    }
  }, [isPlaying]);

  const handlePresetChange = (preset: Preset) => {
    setActivePreset(preset.name);
    setColors(preset.colors);
  };

  const handleColorChange = (index: number, val: string) => {
    setActivePreset('Custom');
    const newColors = [...colors];
    newColors[index] = val;
    setColors(newColors);
  };

  const handleRandomizeColors = () => {
    setActivePreset('Custom');
    const newColors = Array.from({ length: 4 }, () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    );
    setColors(newColors);
  };

  const handleDownloadRequest = () => {
    setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    setShowExportDialog(true);
  };

  const performExport = (width: number, height: number, split?: boolean) => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    const program = programRef.current;
    const locs = uniformLocsRef.current;

    if (!canvas || !gl || !program) return;

    // Save current state
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    // Resize for export
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);

    // Update resolution uniform
    gl.uniform2f(locs.resolution, width, height);

    // Update other uniforms to ensured they are fresh (though they are updated in render loop too)
    gl.uniform1f(locs.time, timeRef.current);
    // mouse is harder to "scale" perfectly if we wanted it relative, 
    // but usually for export we just want the current state.
    // However, if the user chose a different aspect ratio, we might want to reconsider mouse mapping.
    // For now, let's just keep it as is.

    if (colorsRef.current) {
      gl.uniform3fv(locs.color1, hexToRgb(colorsRef.current[0]));
      gl.uniform3fv(locs.color2, hexToRgb(colorsRef.current[1]));
      gl.uniform3fv(locs.color3, hexToRgb(colorsRef.current[2]));
      gl.uniform3fv(locs.color4, hexToRgb(colorsRef.current[3]));
    }
    gl.uniform1f(locs.centerForce, centerForceRef.current ? 1.0 : 0.0);
    gl.uniform1f(locs.complexity, complexityRef.current);

    // Render 
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (split) {
      const slideWidth = 1080;
      const slides = Math.round(width / slideWidth);

      // Create a temporary 2D canvas for cropping
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = slideWidth;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');

      if (ctx) {
        for (let i = 0; i < slides; i++) {
          ctx.clearRect(0, 0, slideWidth, height);
          // Draw a segment of the WebGL canvas onto the 2D canvas
          // Note: drawImage can take another canvas as source
          ctx.drawImage(
            canvas,
            i * slideWidth, 0, slideWidth, height, // Source rectangle
            0, 0, slideWidth, height              // Destination rectangle
          );

          const link = document.createElement('a');
          link.download = `hiss-carousel-slide-${i + 1}-${Date.now()}.png`;
          link.href = tempCanvas.toDataURL('image/png', 1.0);
          link.click();
        }
      }
    } else {
      // Download single image
      const link = document.createElement('a');
      link.download = `hiss-pattern-${width}x${height}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }

    // Restore
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    gl.viewport(0, 0, originalWidth, originalHeight);
    gl.uniform2f(locs.resolution, originalWidth, originalHeight);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    glRef.current = gl;
    programRef.current = program;
    gl.useProgram(program);

    // Set up a full-screen rectangle
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const mouseUniformLocation = gl.getUniformLocation(program, 'u_mouse');
    const centerForceUniformLocation = gl.getUniformLocation(program, 'u_centerForce');
    const complexityUniformLocation = gl.getUniformLocation(program, 'u_complexity');

    // Color uniform locations
    const color1Loc = gl.getUniformLocation(program, 'u_color1');
    const color2Loc = gl.getUniformLocation(program, 'u_color2');
    const color3Loc = gl.getUniformLocation(program, 'u_color3');
    const color4Loc = gl.getUniformLocation(program, 'u_color4');

    uniformLocsRef.current = {
      resolution: resolutionUniformLocation,
      time: timeUniformLocation,
      mouse: mouseUniformLocation,
      centerForce: centerForceUniformLocation,
      complexity: complexityUniformLocation,
      color1: color1Loc,
      color2: color2Loc,
      color3: color3Loc,
      color4: color4Loc,
    };

    let startTime = Date.now();
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = window.innerHeight - e.clientY; // Invert Y for WebGL
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const render = () => {
      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlayingRef.current) {
        timeRef.current += delta;
      }

      gl.uniform1f(timeUniformLocation, timeRef.current);
      gl.uniform2f(mouseUniformLocation, mouseX, mouseY);

      // Update Uniforms from refs
      gl.uniform1f(centerForceUniformLocation, centerForceRef.current ? 1.0 : 0.0);
      gl.uniform1f(complexityUniformLocation, complexityRef.current);

      if (colorsRef.current) {
        const c1 = hexToRgb(colorsRef.current[0]);
        const c2 = hexToRgb(colorsRef.current[1]);
        const c3 = hexToRgb(colorsRef.current[2]);
        const c4 = hexToRgb(colorsRef.current[3]);

        gl.uniform3fv(color1Loc, c1);
        gl.uniform3fv(color2Loc, c2);
        gl.uniform3fv(color3Loc, c3);
        gl.uniform3fv(color4Loc, c4);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // WebGL init runs once

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      <Controls
        presets={PRESETS}
        activePreset={activePreset}
        onPresetChange={handlePresetChange}
        colors={colors}
        onColorChange={handleColorChange}
        onRandomizeColors={handleRandomizeColors}
        centerForce={centerForce}
        setCenterForce={setCenterForce}
        complexity={complexity}
        setComplexity={setComplexity}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onDownload={handleDownloadRequest}
      />

      <ResolutionDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={performExport}
        currentWidth={viewportSize.width}
        currentHeight={viewportSize.height}
      />
    </>
  );
};