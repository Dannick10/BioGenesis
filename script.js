const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

addEventListener("mousemove", (e) => colisionMouse(e));

addEventListener("keydown", (e) => {
  if (e.key === " ") {
    tracingLine = !tracingLine;
  }
  if (e.key === "a") {
    latancy = latancy - 0.1;
  }

  if (e.key === "d") {
    latancy = latancy + 0.1;
  }
  latancy = Math.min(latancy, 0.1);

  if (e.key === "w") {
    size = size + 0.1;
  }

  if (e.key === "s") {
    size = size - 0.1;
  }

  size = Math.max(size, 0.1);
});

function draw(x, y, c, s) {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

let particles = [];
function particle(x, y, c, id) {
  return {
    id: id,
    x: x,
    y: y,
    vx: 0,
    vy: 0,
    color: c,
  };
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function create(number, color, id) {
  group = [];
  for (let i = 0; i < number; i++) {
    group.push(
      particle(random(0, canvas.width), random(0, canvas.height), color, id)
    );
  }
  return group;
}

function rule(p1, p2, g) {
  let particles1 = p1.particles;
  let particles2 = p2.particles;

  for (let i = 0; i < particles1.length; i++) {
    let fx = 0;
    let fy = 0;
    let F;

    for (let j = 0; j < particles2.length; j++) {
      let a = particles1[i];
      let b = particles2[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0 && d < 80) {
        F = (g * 1) / d;
        fx += F * dx;
        fy += F * dy;
        a.vx = F * dx * latancy;
        a.vy = F * dy * latancy;
        a.x += a.vx;
        a.y += a.vy;

        if (d < 30) {
          if (tracingLine) {
            line(a.x, a.y, b.x, b.y, a.color);
          }
        }

        if (a.x <= size || a.x - size >= canvas.width) {
          a.vx = -a.vx;
          a.x += a.vx;
        }
        if (a.y <= size || a.y - size >= canvas.height) {
          a.vy = -a.vy;
          a.x += a.vy;
        }

        if (b.x <= size || b.x - size >= canvas.width) {
          b.vx = -b.vx;
          b.x += b.vx;
        }

        if (b.y <= size || b.y - size >= canvas.height) {
          b.vy = -b.vy;
          b.x += b.vy;
        }
      }
    }
  }
}

function line(x1, y1, x2, y2, c) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = c;
  ctx.lineWidth = size;
  ctx.stroke();
  ctx.closePath();
}

function colisionMouse(mouse) {
  for (let i = 0; i < particles.length; i++) {
    let a = particles[i];
    let dx = mouse.clientX - a.x;
    let dy = mouse.clientY - a.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    if (d > 0 && d < 50) {
      a.x = a.vx + mouse.clientX;
      a.y = a.vy + mouse.clientY;
    }
  }
}
function createObject(name, quantity, color) {
  const idObj = Math.random().toString(36).substring(2, 15) + `${name}`;

  const obj = {
    id: idObj,
    name: name,
    particles: create(quantity, color, idObj),
  };
  particles = particles.concat(obj.particles);
  return obj;
}
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    draw(particles[i].x, particles[i].y, particles[i].color, 2);
    particles[i].x += particles[i].vx;
    particles[i].y += particles[i].vy;
  }
  requestAnimationFrame(update);

  AllRules.forEach((r) => rule(r.A, r.B, r.g));

  ctx.globalCompositeOperation = filter;
}

function rules(A, B, n) {
  return {
    A: A,
    B: B,
    g: n,
  };
}

const AllBacterias = [
  
];

const AllRules = [
  
];

let filter = "";

function Menu() {
  const menu = document.createElement("div");

  menu.innerHTML = "";
  menu.id = "menu";
  menu.innerHTML = `
    <h1>BioGenesis</h1>
    <Button   
    id="btn-menu"
    >Criar Bacteria</Button>
    <Button 
    id="btn-regra"
    >Criar Regra</Button>
    <Button id="btn-ver-bacterias">
     Ver Bacterias
    </button>
    <Button id="clean">
   Limpar
    </button>
    </div>
    <div
    style="
      display: flex;
      flex-direction: column;
      gap: 10px;
    "
    >
    <p class="pLatency">Latencia: ${latancy}</p>
    <div class="latency">
    <Button>-</Button>
    <Button>+ </Button>
    <div>
    <p class="pSize">tamanho: ${size}</p>
    <div class="size">
    <Button>-</Button>
    <Button>+ </Button>
    </div>
    <p class="pLine">Linha: ${tracingLine}</p>
    <div class="tracing">
    <Button>false</Button>
    </div>
    <div id="settings" style="display: flex; flex-direction: column; gap: 10px; padding-top: 20px;">
    <Button>Configurações</Button>
    </div>
   
  `;

  document.body.appendChild(menu);

  const divLatency = document.querySelectorAll(".latency button");
  const divSize = document.querySelectorAll(".size button");
  const divTracingLine = document.querySelectorAll(".tracing button");

  const Pline = document.querySelector(".pLine");
  const Psize = document.querySelector(".pSize");
  const Platency = document.querySelector(".pLatency");

  divLatency[0].addEventListener("click", () => {
    latancy = latancy - 0.1;
    Platency.innerHTML = `latencia: ${latancy}`;
  });

  divLatency[1].addEventListener("click", () => {
    latancy = latancy + 0.1;
    Platency.innerHTML = `latencia: ${latancy}`;
  });

  divSize[0].addEventListener("click", () => {
    size = size - 0.1;
    Psize.innerHTML = `tamanho: ${size}`;
  });

  divSize[1].addEventListener("click", () => {
    size = size + 0.1;
    Psize.innerHTML = `tamanho: ${size}`;
  });

  divTracingLine[0].addEventListener("click", (e) => {
    tracingLine = !tracingLine;
    e.target.innerHTML = tracingLine ? "true" : "false";
    Pline.innerHTML = `Linha: ${tracingLine}`;
  });

  const btnVerBacterias = document.querySelector("#btn-ver-bacterias");
  const btnRegra = document.querySelector("#btn-regra");
  const btnMenu = document.querySelector("#btn-menu");
  const clean = document.querySelector("#clean");
  const settings = document.querySelector("#settings");
  btnMenu.addEventListener("click", Bacteria);
  btnRegra.addEventListener("click", makeRuleMenu);
  btnVerBacterias.addEventListener("click", seeAllBacterias);
  settings.addEventListener("click", settingsMenu);
  clean.addEventListener("click", cleanAll);
}

function cleanAll() {
  while (AllBacterias.length > 0) {
    AllBacterias.pop();
  }
  while (AllRules.length > 0) {
    AllRules.pop();
  }

  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function Bacteria() {
  const getMenu = document.querySelector("#menu");
  getMenu.innerHTML = `
    <h1>Criação</h1>
    <label for="nome">Nome:</label>
    <input autocomplete="off" type="text" name="nome"  />
    <label for="quantidade">Quantidade:</label>
    <input autocomplete="off" type="number" step="0.1" min=".1"  name="quantidade"  />
    <label for="cor">Cor:</label>
    <input autocomplete="off" type="color" class="color" name="cor" />
    <label for="#">ou</label>
    <input id="valueColor" type="text" name="#" placeholder="digite a cor" />

    <Button
    id="btn-make"
    >
    Criar Bacteria
    </Button>

    <Button
    id="btn-back"
    >  
     Voltar
    </Button>
  `;
  const value = document.querySelector("input[name='#']");
  const color = document.querySelector(".color");

  color.addEventListener("change", (e) => {
    value.value = e.target.value;
  });

  value.addEventListener("change", (e) => {
    color.value = e.target.value;
  });

  const btnMake = document.querySelector("#btn-make");
  const btnBack = document.querySelector("#btn-back");
  btnMake.addEventListener("click", makeBacteryMenu);
  btnBack.addEventListener("click", () => {
    const menu = document.querySelector("#menu");
    menu.remove();
    Menu();
  });
}

function makeRuleMenu() {
  const getMenu = document.querySelector("#menu");
  getMenu.innerHTML = `
    <h1>Regras BioGenesis</h1> 
  `;

  getMenu.innerHTML += '<label for="first">Primeira Bacteria: </label>';

  getMenu.innerHTML += `
    <select
    id="first"
    >
    ${AllBacterias.map((bacteria) => {
      return `<option value="${bacteria.name}">${bacteria.name}</option>`;
    })}
    </select>
  `;

  getMenu.innerHTML += '<label for="second">Segunda Bacteria: </label>';

  getMenu.innerHTML += `
    <select
    id="second"
    >
    ${AllBacterias.map((bacteria) => {
      return `<option value="${bacteria.name}">${bacteria.name}</option>`;
    })}
    </select>
  `;

  getMenu.innerHTML += '<label for="g">G: </label>';
  getMenu.innerHTML += `
  <input type="number" id="g" />
  `;

  getMenu.innerHTML += `
<Button
 id="btn-make"
>
  Criar Regra
  </Button>

  <Button
  id="btn-back"
  >
  Voltar
  </button>
`;

  getMenu.innerHTML += `
  ${AllBacterias.length == 0 ? `<p>Não há Bacterias para criar regras</p>` : ""}

  ${AllRules.length !== 0 ? `<h1>Regras</h1>` : ""}
 
   <div> 

   </div>
   <div
   class="AllrulesDiv"
   style=" overflow-Y:"scrollY; height:"100px"
   >
  ${AllRules.map((rule) => {
    return `
  <p
  class="rules"
  data-a="${rule.A.name}"
  data-b="${rule.B.name}"
  data-g="${rule.g}"
  style="background-color: white; color: black; padding: 10px; border-radius: 5px; margin-bottom: 10px; font-weight: bold; display: flex; justify-content: center; align-items: center; gap: 10px;">
  ${rule.A.name} + ${rule.B.name} = ${rule.g}
  </p>
  `;
  }).join("")}
 </div>
  </div>
 `;

  const optionsRules = document.querySelectorAll(".rules");
  optionsRules.forEach((option) => {
    option.addEventListener("click", () => {
      let removeRule = AllRules.find((rule) => {
        return (
          rule.A.name == option.dataset.a &&
          rule.B.name == option.dataset.b &&
          rule.g == option.dataset.g
        );
      });

      AllRules.splice(AllRules.indexOf(removeRule), 1);
      menu.remove();
      Menu();
    });
  });

  const btnMake = document.querySelector("#btn-make");
  const input = document.querySelector("#g");
  const first = document.querySelector("#first");
  const second = document.querySelector("#second");

  const btnBack = document.querySelector("#btn-back");

  btnMake.addEventListener("click", () => {
    let bacteriaOne = AllBacterias.find((bacteria) => {
      return bacteria.name == first.value;
    });

    let bacteriaTwo = AllBacterias.find((bacteria) => {
      return bacteria.name == second.value;
    });

    AllRules.push(rules(bacteriaOne, bacteriaTwo, input.value));
    menu.remove();
    Menu();
  });
  btnBack.addEventListener("click", () => {
    const menu = document.querySelector("#menu");
    menu.remove();
    Menu();
  });
}

function makeBacteryMenu() {
  const inputs = document.querySelectorAll("input");
  const nome = inputs[0].value.toLowerCase();
  const quantidade = inputs[1].value.toLocaleLowerCase();
  const cor = inputs[2].value.toLocaleLowerCase();

  if (nome === "" || quantidade === "" || cor === "") {
    alert("Preencha todos os campos");
    return;
  }

  AllBacterias.push(createObject(nome, quantidade, cor));
  menu.remove();
  Menu();
}

function seeAllBacterias() {
  const getMenu = document.querySelector("#menu");
  getMenu.innerHTML = `
    <h1>Bacterias</h1>
  `;

  AllBacterias.length == 0
    ? (getMenu.innerHTML += `<p>Não há Bacterias</p>`)
    : "";

  getMenu.innerHTML += `
   ${AllBacterias.map((bacteria) => {
     return `
      <div
      style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 5px;
      background-color: white;
      color: black;
      margin-bottom: 10px;
      "
      id="${bacteria.id}"
      class="getBacteria"
      >
      <p>${bacteria.name}</p>
      </div>
      `;
   }).join("")}
  `;

  getMenu.innerHTML += `
 <button id="btn-back">Voltar</button>
  `;

  const getBacteria = document.querySelectorAll(".getBacteria");

  getBacteria.forEach((bacteria) => {
    bacteria.addEventListener("click", (e) => {
      seeInfoBacterias(e.target.id);
    });
  });

  const btnBack = document.querySelector("#btn-back");
  btnBack.addEventListener("click", () => {
    const menu = document.querySelector("#menu");
    menu.remove();
    Menu();
  });
}

const MenuButton = document.querySelector(".MenuButton");

MenuButton.addEventListener("click", (e) => {
  const menu = document.querySelector("#menu");
  if (menu) {
    menu.remove();
    MenuButton.removeAttribute("id", "active");
  } else {
    Menu();
    MenuButton.setAttribute("id", "active");
  }
});

function seeInfoBacterias(id) {
  const getMenu = document.querySelector("#menu");
  const filterBacteria = AllBacterias.find((bacteria) => {
    return bacteria.id == id;
  });

  getMenu.innerHTML = `
    <h1>inf ${filterBacteria.name}</h1>
  `;

  const allParticles = filterBacteria.particles;

  getMenu.innerHTML += `
    <button id="btn-back">Voltar</button>
    <button id="delete">deletar</button>
  `;

  getMenu.innerHTML += `
    <div
    class="AllrulesDiv"
    >
    ${allParticles
      .map((particle, i) => {
        return `
        bacteria ${i + 1}
        <div
        style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;
        background-color: white;
        color: black;
        margin-bottom: 10px;
        "
        id="${particle.name}"
        class="getBacteria"
        >
          <div>X:${Math.trunc(particle.x)}</div>
          <div>Y:${Math.trunc(particle.y)}</div>
          <div>velX:${particle.vx}</div>
          <div>velY:${particle.vy}</div>
        </div>
        `;
      })
      .join("")}
      </div>
      `;

  const btnBack = document.querySelector("#btn-back");
  btnBack.addEventListener("click", () => {
    const menu = document.querySelector("#menu");
    menu.remove();
    Menu();
    seeAllBacterias();
  });

  const deleteBtn = document.querySelector("#delete");

  deleteBtn.addEventListener("click", () => {
    const bacteriaIndex = AllBacterias.findIndex(
      (bacteria) => bacteria.id === id
    );
    if (bacteriaIndex > -1) {
      AllBacterias.splice(bacteriaIndex, 1);
    }

    particles = particles.filter((particle) => particle.id !== id);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    menu.remove();
    Menu();
  });
}

function settingsMenu() {
  const getMenu = document.querySelector("#menu");
  getMenu.innerHTML = `
    <h1>Config</h1>
   `;

  ctx.globalCompositeOperation = "color";

  getMenu.innerHTML += `
   <label for="filter">Filtros</label>
   <select id="filter">
  <option value="source-over">Normal</option>
  <option value="source-in">Source In</option>
  <option value="source-out">Source Out</option>
  <option value="source-atop">Source Atop</option>
  <option value="destination-over">Destination Over</option>
  <option value="destination-in">Destination In</option>
  <option value="destination-out">Destination Out</option>
  <option value="destination-atop">Destination Atop</option>
  <option value="lighter">Lighter</option>
  <option value="copy">Copy</option>
  <option value="xor">XOR</option>
  <option value="multiply">Multiply</option>
  <option value="screen">Screen</option>
  <option value="overlay">Overlay</option>
  <option value="darken">Darken</option>
  <option value="lighten">Lighten</option>
  <option value="color-dodge">Color Dodge</option>
  <option value="color-burn">Color Burn</option>
  <option value="hard-light">Hard Light</option>
  <option value="soft-light">Soft Light</option>
  <option value="difference">Difference</option>
  <option value="exclusion">Exclusion</option>
  <option value="hue">Hue</option>
  <option value="saturation">Saturation</option>
  <option value="color">Color</option>
  <option value="luminosity">Luminosity</option>
</select>

   <label for="background">Cor de fundo</label>
   <input class="color" type="color" id="background" value="#000000">
   `;

  getMenu.innerHTML += `
   <Button>voltar</Button>
   `;

  const btnBack = document.querySelector("Button");
  btnBack.addEventListener("click", () => {
    const menu = document.querySelector("#menu");
    menu.remove();
    Menu();
  });
  const color = document.querySelector(".color");
  color.addEventListener("change", (e) => {
    canvas.style.backgroundColor = e.target.value;
  });
  const filterDivd = document.querySelector("#filter");
  filterDivd.addEventListener("change", (e) => {
    filter = e.target.value;
  });
}

let latancy = 0.9;
let size = 2;
let tracingLine = false;
update();
