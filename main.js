var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'New',
    dom: {
      createContainer: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var graphics;
var game_width = config['width'];
var game_height = config['height'];
var line1, line2;
var axis_x, axis_y;
var text;
var rot = 1, b_rot = 1;
var n1 = 1, n2 = 1.33;
var speed = 0.01;
var element;
var anim = false;

function preload()
{
  this.load.html('ui_input', './ui_input.html');
}

function create ()
{
  graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.refresh();

  // Lines
  line1 = new Phaser.Geom.Line(
    game_width / 4, game_height / 4,
    game_width / 2, game_height / 2);
  line2 = new Phaser.Geom.Line(
    game_width / 2 , game_height / 2,
    game_width * 3/4, game_height * 3/4);

  // Axis
  axis_x = new Phaser.Geom.Line(
    game_width / 6 , game_height / 2,
    game_width * 5/6, game_height / 2);
  axis_y = new Phaser.Geom.Line(
    game_width / 2 , game_height / 6,
    game_width / 2, game_height * 5/6);

  text = this.add.text(20, 20, '');

  element = this.add.dom(game_width * 4.8/6, game_height / 10).createFromCache('ui_input');
  element.addListener('click');
  element.on('click', function(event) {
    if (event.target.id === 'start')
    {
      anim == true ? anim = false : anim = true;

      speed = this.getChildByID('speed').value;
    }

    if (event.target.id === 'update')
    {

      anim = false;

      deg = 90 - this.getChildByID('angle').value;
      angle = Phaser.Math.DegToRad(deg);

      if (deg > 180)
      {
        deg = 180;
        angle = Math.PI;
      }
      else if (deg < 0)
      {
        deg = 0;
        angle = 0;
      }

      Phaser.Geom.Line.SetToAngle(
        line1,
        game_width/2 - Math.cos(angle) * 250,
        game_height/2 - Math.sin(angle) * 250,
        angle,
        250
      );
      line1.x2 = game_width / 2;
      line1.y2 = game_height / 2;

      n1 = this.getChildByID('n1').value;
      n2 = this.getChildByID('n2').value;
      if (n1 <= 1)
      {
        n1 = 1;
      }
      if (n2 <= 1)
      {
        n2 = 1;
      }

    }
  });
  //element.setPerspective(1);
  //element.addListener('click');
  //this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#ffffff");

}

function update ()
{

  var angle = Phaser.Geom.Line.Angle(line1);
  var deg = Phaser.Math.RadToDeg(angle);

  if (anim === true)
  {
    rot = b_rot;
  }
  else
  {
    rot = 0;
  }

  if ((deg * -1) > 0 && (deg * -1) <= 90) {
    rot = 1;
    b_rot = 1;
  }
  else if ((deg * -1) > 90 && (deg * -1) <= 180) {
    rot = -1;
    b_rot = -1;
  }

  Phaser.Geom.Line.Rotate(line1, speed * rot);
  line1.x2 = game_width / 2;
  line1.y2 = game_height / 2;
  var angle = Phaser.Geom.Line.Angle(line1);
  line1.x1 = game_width/2 - Math.cos(angle) * 250;
  line1.y1 = game_height/2 - Math.sin(angle) * 250;

  var new_angle;
  if (deg <= 90) {
    new_angle = Math.PI/2 - Math.asin((n1/n2) * Math.sin(Math.PI/2 - angle));
  }
  else {
    new_angle = Math.PI/2 + Math.asin((n1/n2) * Math.sin(angle - Math.PI/2));
  }

  Phaser.Geom.Line.SetToAngle(
    line2,
    game_width / 2,
    game_height / 2,
    new_angle,
    250
  );

  graphics.clear();

  // Lines
  graphics.lineStyle(4, 0xaa00aa);
  graphics.strokeLineShape(line1);
  graphics.lineStyle(4, 0xff0000);
  graphics.strokeLineShape(line2);

  // Axis
  graphics.lineStyle(2, 0x999999);
  graphics.strokeLineShape(axis_x);
  graphics.lineStyle(2, 0x999999);
  graphics.strokeLineShape(axis_y);
  //this.add.circle(game_width/2, game_height/2, 5, 0x0000ff);

  text.setText(
    'n1 * sin(alpha1) = n2 * sin(alpha2)' +
    '\n' +
    '\n' +
    'Angle of Incidence: ' +
    Number.parseFloat(90 - Phaser.Math.RadToDeg(angle)).toPrecision(4) +
    '\n' +
    'Angle of Refaction: ' +
    Number.parseFloat(90 - Phaser.Math.RadToDeg(new_angle)).toPrecision(4) +
    '\n' +
    'Refractive index n1: ' +
    n1 +
    '\n' +
    'Refractive index n2: ' +
    n2
  );

}
