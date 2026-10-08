import { useEffect, useRef } from "react";

const HeroBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Node definition
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      pulseSpeed: number;
    }

    const nodes: Node[] = [];
    const NODE_COUNT = 55;
    const CONNECTION_DISTANCE = 200;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
        });
      }
    };

    const draw = () => {
      // Clear with deep black background
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, width, height);

      // Dark-red/orange radial glow — bottom-right (where 3D object lives)
      const glowRight = ctx.createRadialGradient(
        width * 0.78, height * 0.65, 0,
        width * 0.78, height * 0.65, width * 0.55
      );
      glowRight.addColorStop(0, "rgba(140, 30, 0, 0.18)");
      glowRight.addColorStop(0.5, "rgba(80, 10, 0, 0.08)");
      glowRight.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowRight;
      ctx.fillRect(0, 0, width, height);

      // Subtle orange glow — top-left corner (accent)
      const glowLeft = ctx.createRadialGradient(
        width * 0.05, height * 0.2, 0,
        width * 0.05, height * 0.2, width * 0.3
      );
      glowLeft.addColorStop(0, "rgba(255, 75, 22, 0.07)");
      glowLeft.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowLeft;
      ctx.fillRect(0, 0, width, height);

      // Bottom vignette to ground the scene
      const vignette = ctx.createLinearGradient(0, height * 0.6, 0, height);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Update and draw nodes + connections
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;

        // Wrap around edges
        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.45;

            // Text-safe zone: keep left side (text area) more subtle
            const isNearText = n.x < width * 0.52 && n.y > height * 0.1 && n.y < height * 0.75;
            const lineAlpha = isNearText ? alpha * 0.3 : alpha;

            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);

            // Orange gradient line
            const grad = ctx.createLinearGradient(n.x, n.y, m.x, m.y);
            grad.addColorStop(0, `rgba(255, 75, 22, ${lineAlpha})`);
            grad.addColorStop(0.5, `rgba(255, 106, 42, ${lineAlpha * 1.2})`);
            grad.addColorStop(1, `rgba(200, 50, 0, ${lineAlpha * 0.7})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = isNearText ? 0.4 : 0.9;
            ctx.stroke();
          }
        }

        // Draw node dot with pulse glow
        const pulseScale = 1 + Math.sin(n.pulse) * 0.4;
        const glowRadius = n.radius * pulseScale * 4;
        const isNearText = n.x < width * 0.52 && n.y > height * 0.1 && n.y < height * 0.75;
        const nodeAlpha = isNearText ? 0.25 : 0.85;

        // Glow halo
        const nodeGlow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowRadius);
        nodeGlow.addColorStop(0, `rgba(255, 106, 42, ${nodeAlpha * 0.6})`);
        nodeGlow.addColorStop(1, "rgba(255, 75, 22, 0)");
        ctx.fillStyle = nodeGlow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 140, 80, ${nodeAlpha})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createNodes();
    draw();

    const handleResize = () => {
      resize();
      createNodes();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default HeroBg;
