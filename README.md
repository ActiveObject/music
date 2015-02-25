# Music app

## Development
The app has next requirements:
  - Node.js v0.10.x or v0.12.x
  - registered [vk.com] application
  - account on [divshot] static web hosting

### Installation

```
git clone https://github.com/ActiveObject/music.git
cd music
npm install
```

Set the vk.com application id:

```
export MUSIC_APP_ID=123
```

Run development server:

```
npm run dev
```

Then open [http://localhost:5003](http://localhost:5003)

### Deploy
Divshot is the default deploy target:

```
npm run deploy
```


[divshot]: https://divshot.com
[vk.com]: http://vk.com/dev