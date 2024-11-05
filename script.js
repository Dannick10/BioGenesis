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
function particle(x, y, c) {
  return {
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

function create(number, color) {
  group = [];
  for (let i = 0; i < number; i++) {
    group.push(
      particle(random(0, canvas.width), random(0, canvas.height), color)
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

        if (d < 20) {
          if (tracingLine) {
            line(a.x, a.y, b.x, b.y, a.color);
          }
        }

        if (a.x <= 0 || a.x >= canvas.width) {
          a.vx = -a.vx;
          a.x = a.vx;
        }
        if (a.y <= 0 || a.y >= canvas.height) {
          a.vy = -a.vy;
          a.y = a.vy;
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
  const obj = {
    name: name,
    particles: create(quantity, color),
  };
  particles = particles.concat(obj.particles);
  return obj;
}
function udpate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    draw(particles[i].x, particles[i].y, particles[i].color, 2);
    particles[i].x += particles[i].vx;
    particles[i].y += particles[i].vy;
  }
  requestAnimationFrame(udpate);

  AllRules.forEach((r) => rule(r.A, r.B, r.g));
}

function rules(A, B, n) {
  return {
    A: A,
    B: B,
    g: n,
  };
}

const AllBacterias = [];

const AllRules = [];

function Menu() {
  const menu = document.createElement("div");
  menu.style = `
  position: fixed;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  z-index: 1;
  background-color: rgba(0,0,0,0.9);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  color: white;
  `;

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
    <p>Latencia: ${latancy}</p>
    <p>tamanho: ${size}</p>
    <p>Linha: ${tracingLine}</p>
  `;
  document.body.appendChild(menu);

  const btnRegra = document.querySelector("#btn-regra");
  const btnMenu = document.querySelector("#btn-menu");
  const clean = document.querySelector("#clean");
  btnMenu.addEventListener("click", Bacteria);
  btnRegra.addEventListener("click", makeRuleMenu);
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
    <input autocomplete="off" type="color" name="cor" 
    style="
    -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100px;
  height: 100px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
    " />
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
  console.log(AllBacterias);
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

let latancy = 0.9;
let size = 1;
let tracingLine = false;
udpate();

