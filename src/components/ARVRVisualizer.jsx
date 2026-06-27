import { useEffect, useRef, useState } from 'react';
import heroImg from '../assets/hero.png';
import './ARVRVisualizer.css';

const ARVRVisualizer = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const heroImgRef = useRef(null);
  
  // Interactive control states
  const [theme, setTheme] = useState('cyan'); // 'cyan' | 'pink' | 'green'
  const [showGrid, setShowGrid] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [showHUD, setShowHUD] = useState(true);
  const [scanActive, setScanActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, px: 0, py: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Load the personal photo on mount
  useEffect(() => {
    const img = new Image();
    img.src = heroImg;
    img.onload = () => {
      heroImgRef.current = img;
      setImgLoaded(true);
    };
    img.onerror = () => {
      console.error("Failed to load hero image. Defaulting to text placeholder.");
    };
  }, []);


  // Get color hex based on theme state
  const getColorHex = (themeName) => {
    switch (themeName) {
      case 'pink': return '#ff007f';
      case 'green': return '#39ff14';
      case 'cyan':
      default:
        return '#00f0ff';
    }
  };

  const getRgb = (themeName) => {
    switch (themeName) {
      case 'pink': return '255, 0, 127';
      case 'green': return '57, 255, 20';
      case 'cyan':
      default:
        return '0, 240, 255';
    }
  };

  // Trigger scanning sweep
  const triggerScan = () => {
    if (scanActive) return;
    setScanActive(true);
    setTimeout(() => {
      setScanActive(false);
    }, 1500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const maxParticles = 60;
    
    // Scanline animation variable
    let scanY = 0;
    let scanSpeed = 3;

    // Grid animation variable
    let gridOffset = 0;
    
    // Rotation angles for HUD circles
    let angle1 = 0;
    let angle2 = 0;

    // Target frame rates & resize handler
    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(maxParticles, Math.floor((canvas.width * canvas.height) / 8000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 1,
          glow: Math.random() * 0.5 + 0.5,
          seed: Math.random() * 100
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse positions (smoothed for fluid 3D tilt)
    let smoothMouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      setMousePos({ 
        x: Math.round(rawX), 
        y: Math.round(rawY),
        px: Math.round((rawX / canvas.width) * 100),
        py: Math.round((rawY / canvas.height) * 100)
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Main Draw loop
    const draw = () => {
      if (!ctx || !canvas) return;

      const activeColor = getColorHex(theme);
      const activeRgb = getRgb(theme);

      // Smooth mouse transition
      smoothMouse.x += (mousePos.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (mousePos.y - smoothMouse.y) * 0.08;

      // 1. Trail effect for dark background
      ctx.fillStyle = 'rgba(7, 3, 19, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw 3D Perspective Grid
      if (showGrid) {
        ctx.save();
        ctx.strokeStyle = `rgba(${activeRgb}, 0.08)`;
        ctx.lineWidth = 1;

        const horizon = canvas.height * 0.35;
        gridOffset = (gridOffset + 0.2) % 40;

        // X tilting based on mouse position
        const tiltX = ((smoothMouse.x - canvas.width / 2) / canvas.width) * 80;
        const tiltY = ((smoothMouse.y - canvas.height / 2) / canvas.height) * 30;

        // Draw horizontal lines converging to horizon
        for (let y = horizon; y < canvas.height; y += 20) {
          const ratio = (y - horizon) / (canvas.height - horizon);
          // Curved spacing for perspective
          const py = horizon + Math.pow(ratio, 1.8) * (canvas.height - horizon);
          ctx.beginPath();
          ctx.moveTo(0, py + tiltY);
          ctx.lineTo(canvas.width, py + tiltY);
          ctx.stroke();
        }

        // Draw radiating vertical lines
        const vanishingPointX = canvas.width / 2 + tiltX;
        const numVLines = 24;
        for (let i = 0; i <= numVLines; i++) {
          const targetX = (canvas.width / numVLines) * i;
          ctx.beginPath();
          ctx.moveTo(vanishingPointX, horizon + tiltY);
          ctx.lineTo(targetX, canvas.height);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Draw Particle Web Network
      if (showParticles) {
        ctx.save();
        
        // Update and draw particles
        particles.forEach((p) => {
          // Normal physics
          p.x += p.vx;
          p.y += p.vy;

          // Boundary checks
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          // Mouse attraction/repulsion
          const dx = smoothMouse.x - p.x;
          const dy = smoothMouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (isHovered && dist < 120) {
            // Push away slightly
            const force = (120 - dist) / 120;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }

          // Scanline interaction (glow amplification)
          let currentGlow = p.glow;
          const distToScan = Math.abs(p.y - scanY);
          if (distToScan < 30) {
            currentGlow = p.glow * (2 - distToScan / 30);
          }

          // Draw node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + (currentGlow - 0.5) * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${activeRgb}, ${currentGlow * 0.7})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = activeColor;
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          // Connect particles to nearby ones
          particles.forEach((other) => {
            const odx = p.x - other.x;
            const ody = p.y - other.y;
            const odist = Math.sqrt(odx * odx + ody * ody);

            if (odist < 80) {
              const alpha = (80 - odist) / 80 * 0.15;
              ctx.strokeStyle = `rgba(${activeRgb}, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });

          // Draw connection to mouse cursor
          if (isHovered && dist < 150) {
            const alpha = (150 - dist) / 150 * 0.25;
            ctx.strokeStyle = `rgba(${activeRgb}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(smoothMouse.x, smoothMouse.y);
            ctx.stroke();
          }
        });
        ctx.restore();
      }

      // 4. Draw AR HUD Overlays
      if (showHUD) {
        ctx.save();
        ctx.font = '9px monospace';
        ctx.fillStyle = `rgba(${activeRgb}, 0.7)`;

        // Update angle rotations
        angle1 += 0.005;
        angle2 -= 0.008;

        // Center HUD Hologram (at center or floating near center visual)
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 - 20;

        // Draw HUD Bracket Borders (Corner brackets)
        const bSize = 15;
        const margin = 20;
        
        // Top-Left
        ctx.strokeStyle = `rgba(${activeRgb}, 0.4)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(margin + bSize, margin); ctx.lineTo(margin, margin); ctx.lineTo(margin, margin + bSize);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(canvas.width - margin - bSize, margin); ctx.lineTo(canvas.width - margin, margin); ctx.lineTo(canvas.width - margin, margin + bSize);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(margin + bSize, canvas.height - margin); ctx.lineTo(margin, canvas.height - margin); ctx.lineTo(margin, canvas.height - margin + bSize);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(canvas.width - margin - bSize, canvas.height - margin); ctx.lineTo(canvas.width - margin, canvas.height - margin); ctx.lineTo(canvas.width - margin, canvas.height - margin + bSize);
        ctx.stroke();

        // Holographic Orbits in background center
        ctx.strokeStyle = `rgba(${activeRgb}, 0.2)`;
        ctx.lineWidth = 1;
        
        // Draw Holographic Profile Avatar in the Center
        const avatarRadius = 75;
        if (imgLoaded && heroImgRef.current) {
          ctx.save();
          // Outer glowing border
          ctx.strokeStyle = activeColor;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 15;
          ctx.shadowColor = activeColor;
          ctx.beginPath();
          ctx.arc(cx, cy, avatarRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0; // Reset

          // Clip path to make photo circular
          ctx.beginPath();
          ctx.arc(cx, cy, avatarRadius, 0, Math.PI * 2);
          ctx.clip();

          // Draw Image
          ctx.drawImage(
            heroImgRef.current,
            cx - avatarRadius,
            cy - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
          );

          // Apply holographic color tint
          ctx.globalCompositeOperation = 'color';
          ctx.fillStyle = activeColor;
          ctx.fillRect(cx - avatarRadius, cy - avatarRadius, avatarRadius * 2, avatarRadius * 2);
          
          // Revert blend mode and add horizontal scanlines
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(${activeRgb}, 0.15)`;
          for (let lineY = cy - avatarRadius; lineY < cy + avatarRadius; lineY += 4) {
            ctx.fillRect(cx - avatarRadius, lineY, avatarRadius * 2, 1);
          }
          ctx.restore();
        } else {
          // Fallback text avatar if image not loaded
          ctx.save();
          ctx.strokeStyle = `rgba(${activeRgb}, 0.5)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, avatarRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = `rgba(${activeRgb}, 0.08)`;
          ctx.beginPath();
          ctx.arc(cx, cy, avatarRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 24px var(--font-sans)';
          ctx.fillStyle = activeColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('AF', cx, cy);
          ctx.restore();
        }

        // Ring 1 (Static)
        ctx.beginPath();
        ctx.arc(cx, cy, 110, 0, Math.PI * 2);
        ctx.stroke();

        // Ring 2 (Dashed & Rotating)
        ctx.beginPath();
        ctx.setLineDash([4, 15]);
        ctx.arc(cx, cy, 125, angle1, angle1 + Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset

        // Ring 3 (Dashed & Counter-Rotating)
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${activeRgb}, 0.12)`;
        ctx.setLineDash([20, 30, 5, 10]);
        ctx.arc(cx, cy, 140, angle2, angle2 + Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset

        // HUD Interactive Scanning Target
        if (isHovered) {
          ctx.strokeStyle = `rgba(${activeRgb}, 0.55)`;
          ctx.beginPath();
          ctx.arc(smoothMouse.x, smoothMouse.y, 16, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(smoothMouse.x - 22, smoothMouse.y);
          ctx.lineTo(smoothMouse.x + 22, smoothMouse.y);
          ctx.moveTo(smoothMouse.x, smoothMouse.y - 22);
          ctx.lineTo(smoothMouse.x, smoothMouse.y + 22);
          ctx.stroke();
        }

        // Scrolling Scanline Sweep
        if (scanActive) {
          scanY += scanSpeed * 2.5;
          if (scanY > canvas.height) scanY = 0;

          // Draw the glow bar
          const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 5);
          gradient.addColorStop(0, 'rgba(' + activeRgb + ', 0)');
          gradient.addColorStop(0.5, 'rgba(' + activeRgb + ', 0.25)');
          gradient.addColorStop(1, 'rgba(' + activeRgb + ', 0.05)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, scanY - 30, canvas.width, 35);

          // Draw bright sweep line
          ctx.strokeStyle = `rgba(${activeRgb}, 0.8)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, scanY);
          ctx.lineTo(canvas.width, scanY);
          ctx.stroke();

          // Render Scanning Text
          ctx.fillStyle = `rgba(${activeRgb}, 0.85)`;
          ctx.fillText(`[!] SYSTEM WIDE SCANNING: ${(Math.min(100, Math.floor((scanY / canvas.height) * 100)))}%`, margin + 15, canvas.height - margin - 25);
        } else {
          scanY += scanSpeed * 0.4;
          if (scanY > canvas.height) scanY = 0;
        }

        // HUD Digital Text Overlay
        ctx.fillStyle = `rgba(${activeRgb}, 0.5)`;
        ctx.fillText(`SYS_STATUS: ACTIVE`, margin + 15, margin + 20);
        ctx.fillText(`MODE: AR_PORTFOLIO_3.0`, margin + 15, margin + 32);
        ctx.fillText(`FPS: 60.0`, margin + 15, margin + 44);

        // Render Cursor Position
        if (isHovered) {
          ctx.fillStyle = `rgba(${activeRgb}, 0.8)`;
          ctx.fillText(`TRK_X: ${mousePos.x}px (${mousePos.px}%)`, margin + 15, canvas.height - margin - 35);
          ctx.fillText(`TRK_Y: ${mousePos.y}px (${mousePos.py}%)`, margin + 15, canvas.height - margin - 23);
        } else {
          ctx.fillText(`TRK_STATUS: SLEEP`, margin + 15, canvas.height - margin - 23);
        }

        // Draw system mock info on the top-right
        ctx.textAlign = 'right';
        ctx.fillStyle = `rgba(${activeRgb}, 0.45)`;
        ctx.fillText(`ENV: IMMERSIVE_VIRTUAL`, canvas.width - margin - 15, margin + 20);
        ctx.fillText(`RESOLV: ${canvas.width}x${canvas.height}`, canvas.width - margin - 15, margin + 32);
        ctx.fillText(`GRID_MESH: ${showGrid ? "ON" : "OFF"}`, canvas.width - margin - 15, margin + 44);
        ctx.textAlign = 'left'; // reset
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [theme, showGrid, showParticles, showHUD, mousePos, isHovered, scanActive, imgLoaded]);

  return (
    <div className="arvr-container" ref={containerRef}>
      <div className="arvr-canvas-wrapper"
           onMouseEnter={() => setIsHovered(true)}
           onMouseLeave={() => setIsHovered(false)}>
        <canvas ref={canvasRef} className="arvr-canvas" />
        
        {/* Futuristic glowing crosshairs on corners */}
        <div className="hud-corner top-left"></div>
        <div className="hud-corner top-right"></div>
        <div className="hud-corner bottom-left"></div>
        <div className="hud-corner bottom-right"></div>

        {/* Glitch Overlay Text when Scanning */}
        {scanActive && (
          <div className="hud-scanning-alert">
            <span className="alert-text">ANALYZING SPATIAL MESH</span>
            <div className="loading-bar">
              <div className="loading-progress" style={{ borderColor: getColorHex(theme) }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Control Console panel */}
      <div className="arvr-controls">
        <div className="control-section">
          <span className="control-label">SISTEM WARNA</span>
          <div className="control-buttons">
            <button 
              className={`control-btn color-cyan ${theme === 'cyan' ? 'active' : ''}`}
              onClick={() => setTheme('cyan')}
              title="Cyber Cyan"
            >
              Cyan
            </button>
            <button 
              className={`control-btn color-pink ${theme === 'pink' ? 'active' : ''}`}
              onClick={() => setTheme('pink')}
              title="Neon Rose"
            >
              Rose
            </button>
            <button 
              className={`control-btn color-green ${theme === 'green' ? 'active' : ''}`}
              onClick={() => setTheme('green')}
              title="Matrix Green"
            >
              Green
            </button>
          </div>
        </div>

        <div className="control-section">
          <span className="control-label">LAPISAN VISUAL</span>
          <div className="control-toggles">
            <button 
              className={`toggle-btn ${showGrid ? 'active' : ''}`}
              onClick={() => setShowGrid(!showGrid)}
            >
              3D Grid
            </button>
            <button 
              className={`toggle-btn ${showParticles ? 'active' : ''}`}
              onClick={() => setShowParticles(!showParticles)}
            >
              Point Web
            </button>
            <button 
              className={`toggle-btn ${showHUD ? 'active' : ''}`}
              onClick={() => setShowHUD(!showHUD)}
            >
              HUD Info
            </button>
          </div>
        </div>

        <div className="control-section actions-section">
          <button 
            className={`action-scan-btn ${scanActive ? 'running' : ''}`}
            onClick={triggerScan}
            disabled={scanActive}
            style={{ 
              '--glow-color': getColorHex(theme),
              '--glow-color-rgb': getRgb(theme)
            }}
          >
            {scanActive ? 'SCANNING SYSTEM...' : 'PEMINDAIAN SPASIAL'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ARVRVisualizer;
