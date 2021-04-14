function ghostCursor() {
  let element = document.body;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: width / 2 };
  let particles = [];
  let canvas, context;

  let baseImage = new Image();
  baseImage.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAAD40lEQVRYhc2W0WtaVxzHP7phGgZLuKILtXZJrw1SOjCYXRxkBCwFn/I6nzryUBjsTxikpLDXPeRhL3vImidflzEiDGWDsl1u4nqhMoLTaWuELC4H9zC2lG53D9dz1KqNtg3Z78V77znH78fv+f7Olc2k5jj3ph3OqbwALKzh5NLnAuIFsL7e4bxAPACbSc25diOOkfDDQRYupdzRgyyeD1ueswTwdt+IigkLawBk72Q4/CnCzhLOzhJn5ogCqJaKlJtXoWmRvZMBwC7sEYsvEosvsrPEmWyNF2A1Lzx/1U/UQ+PWrLq2C3vYhT1CQT/ZL1o496ZfKcjro05sHB27Fwtr0LRwcjivIiNq8WZScybDE8zNX8dI+N08ANZWTU1O3Z7uQMhqWi8V1p5FshsigV/Q9AQEDFcA3GspCJ1u6X7+AiB9W6DV6pS5iqF3xA63yzTr3xIIzzGzEkFUTLSE64IwN5RLsfgiTi7iSMBRYPoACk/+YI6wK6InVEeEgn63K4CZlYSCs7ZqhIJ+AuE5NQ5gF1o4ufSpOekb2ExqzpIeJJKOISpmTwZCQT9AjxPd490Viy9iF/ZIracpZ2x8s/u8/Um/nnfQYjEbxjKP+57LTrALewBuTgaUdMulNYikYzypRfkuifNoa7mnhQcCVEtFtFodTU/0nAndEAQMRMUktZ4eCgq4WxUwaFT2CelRLlf+5dHWsvPVRxPOQAB5KEkXBkGk1tPQtND0hIJIff5ZH0hqPY2omAhzA4DIxQCPdS+Xr0TVnKEHUbVUJO6bQrRb0riFEpQOAGhywYO7LkTTUgGWn99/miGkR/vEYUAIZckzAXDfkm1B2Xax+CKAClpfBQyEucHDTI2QHiVyMQA3rwHw+Nd98l8+ZDUvPM89iqULJPzw4C4A1laLUNBPs14F3LQfbpc7IAdZtV7sXgC6rG+L2z+YrOZPPDAkhN0lZsOUMzZcSiFO3KO4cXTc0xHNelU5IueVM7YKnrReiovSG+r7hwLIMFZLxaFwEqJxdKwcERUTsXtBifvef6tPfDUv1Naf6kC3C5qe6LyQuiq1nuadj2+OLQ7PCaEs+ZaM+6bQ3v1bHT6qGwBtokX5/ozrxhjiMMb/ATEbht064LaWBClnbAQzNCr7AGOJjwVQLRXRfFPtZJsq4d3Cz7baaeIwwhZA758VrVZXosOEgZHEYQwHwHWB+euE2vfSallS/Jvtn5kUp4vDiA5ArwsAxvKVHtHXfpvmftFC/PmUSfHPSOIwpgPguvDB7ZUe4UIlS+P3NwHGEocxHICOCwDv3Zjnx1wJYOxf/cIAz0K8jPD/pv4DiqM4Q7fTRdUAAAAASUVORK5CYII=";

  function init() {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";

    canvas.style.position = "fixed";
    document.body.appendChild(canvas);
    canvas.width = width;
    canvas.height = height;

    bindEvents();
    loop();
  }

  // Bind events that are needed
  function bindEvents() {
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("touchmove", onTouchMove);
    element.addEventListener("touchstart", onTouchMove);
    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(e.touches[i].clientX, e.touches[i].clientY, baseImage);
      }
    }
  }

  function onMouseMove(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    addParticle(cursor.x, cursor.y, baseImage);
  }

  const defaultNum = 5;
  let num = defaultNum;
  function addParticle(x, y, image) {
    num--;
    if (num !== 0) return;
    num = defaultNum;
    particles.push(new Particle(x, y, image));
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height);

    // Update
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(context);
    }

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {

      if (particles[i].lifeSpan < 0) {
        particles.splice(i, 1);
      }
    }
  }

  function loop() {
    updateParticles();
    requestAnimationFrame(loop);
  }

  /**
   * Particles
   */

  function Particle(x, y, image) {
    const lifeSpan = 40;
    this.initialLifeSpan = lifeSpan; //ms
    this.lifeSpan = lifeSpan; //ms
    this.position = { x: x, y: y };

    this.image = image;

    this.update = function (context) {
      this.lifeSpan--;
      context.globalAlpha = Math.max(this.lifeSpan / this.initialLifeSpan, 0);
      context.drawImage(
        this.image,
        this.position.x, // - (this.canv.width / 2) * scale,
        this.position.y //- this.canv.height / 2,
      );
    };
  }

  init();
}
