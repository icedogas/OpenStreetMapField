# OpenStreetMapField Component

OpenStreetMapField — это компонент на базе React и Leaflet, предназначенный для использования с TinaCMS для отображения, геолокации и редактирования местоположений на карте OpenStreetMap.

## Особенности

- Поддержка ввода адреса и конвертации его в географические координаты.
- Возможность перемещения на карте кликом и сохранения нового местоположения.
- Возможность скрытия и показа карты для оптимизации загрузки страницы.

## Требования

- React 17+
- Leaflet
- React-Leaflet
- TinaCMS

## Начало работы

### Установка

1. Клонируйте репозиторий.
   ```bash
   git clone https://github.com/ваше_имя/ваш_репозиторий.git
```
2. Перейдите в каталог проекта.
```
cd ваш_репозиторий
```
3. Установите необходимые зависимости.
```
npm install
```

### Использование
Импортируйте компонент OpenStreetMapField в ваш проект(tina/config.ts):
```
import OpenStreetMapField from './OpenStreetMapField';
```

Включите его в вашу конфигурацию TinaCMS:

```javascript
schema: {
collections: [
{
name: "location",
label: "Location",
path: "content/locations",
fields: [
{
name: "location",
label: "Location",
type: "object",
ui: {
component: OpenStreetMapField,
},
fields: [
{ name: "lat", type: "number", label: "Latitude" },
{ name: "lng", type: "number", label: "Longitude" },
{ name: "address", type: "string", label: "Address" }
],
},
],
},
],

}


### Поддержка

Для вопросов или замечаний, пожалуйста, создайте issue или обсуждение в репозитории.
