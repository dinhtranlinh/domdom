
let ship;
let cursors;
let bullets;
let enemies;
let lastShotTime = 0;
let score = 0;
let scoreText;

function startGame() {
  const config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    parent: null,
    scene: {
      preload,
      create,
      update
    },
    physics: {
      default: 'arcade',
      arcade: { debug: false }
    }
  };

  new Phaser.Game(config);
}

function preload() {
  this.load.image('ship', 'assets/ship.png');
  this.load.image('bullet', 'assets/bullet.png');
  this.load.image('bg', 'assets/bg.jpg');

  this.load.image('firefly1', 'assets/firefly1.png');
  this.load.image('firefly2', 'assets/firefly2.png');
  this.load.image('firefly3', 'assets/firefly3.png');
  this.load.image('firefly4', 'assets/firefly4.png');

  this.load.image('explosion1', 'assets/explosion1.png');
  this.load.image('explosion2', 'assets/explosion2.png');
  this.load.image('explosion3', 'assets/explosion3.png');
  this.load.image('explosion4', 'assets/explosion4.png');
}

function handleShipCrash(ship, enemy) {
  enemy.destroy();
  ship.destroy();
  gameOver.call(this);
}

function create() {
  this.add.image(360, 640, 'bg').setDisplaySize(720, 1280);

  ship = this.physics.add.image(360, 1100, 'ship');
  ship.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  bullets = this.physics.add.group();
  enemies = this.physics.add.group();

  scoreText = this.add.text(20, 20, 'Score: 0', {
    fontSize: '32px',
    fill: '#ffffff',
    fontFamily: 'Arial'
  });

  this.time.addEvent({
    delay: 1500,
    callback: spawnEnemy,
    callbackScope: this,
    loop: true
  });

  this.physics.add.overlap(bullets, enemies, handleHit, null, this);
  this.physics.add.overlap(enemies, ship, handleShipCrash, null, this);
}

function spawnEnemy() {
  const fireflyTypes = ['firefly1', 'firefly2', 'firefly3', 'firefly4'];
  const selected = Phaser.Utils.Array.GetRandom(fireflyTypes);
  const x = Phaser.Math.Between(80, 640);

  const enemy = enemies.create(x, -50, selected)
    .setVelocityY(150)
    .setScale(0.12)
    .setDepth(5);

  return enemy;
}

function handleHit(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();

  const explosions = ['explosion1', 'explosion2', 'explosion3', 'explosion4'];
  const selected = Phaser.Utils.Array.GetRandom(explosions);

  const boom = this.add.image(enemy.x, enemy.y, selected).setScale(0.3).setDepth(10);
  this.time.delayedCall(300, () => boom.destroy());

  score += 10;
  scoreText.setText('Score: ' + score);
}

function gameOver() {
  this.physics.pause();
  this.scene.pause();

  this.add.rectangle(360, 640, 720, 1280, 0x000000, 0.7);

  this.add.text(360, 500, 'Game Over', {
    fontSize: '64px',
    fill: '#fff',
    fontFamily: 'Arial'
  }).setOrigin(0.5);

  this.add.text(360, 600, 'Your Score: ' + score, {
    fontSize: '36px',
    fill: '#fff'
  }).setOrigin(0.5);

  const replayButton = this.add.text(360, 700, 'Play Again', {
    fontSize: '36px',
    backgroundColor: '#00c',
    padding: { x: 20, y: 10 },
    fill: '#fff'
  }).setOrigin(0.5).setInteractive();

  replayButton.on('pointerdown', () => {
    this.scene.restart();
    score = 0;
  });
}

function update(time, delta) {
  if (cursors.left.isDown) ship.setVelocityX(-300);
  else if (cursors.right.isDown) ship.setVelocityX(300);
  else ship.setVelocityX(0);

  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    if (time > lastShotTime + 300) {
      const bullet = bullets.create(ship.x, ship.y - 30, 'bullet')
        .setVelocityY(-600)
        .setScale(0.1);
      lastShotTime = time;
    }
  }
}
