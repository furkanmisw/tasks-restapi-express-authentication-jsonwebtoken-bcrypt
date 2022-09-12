# TASKS REST API example application

## An API where you can log in ( json web token )/register ( bcrypt hash ) / and save, update and delete task with bearer token containing login authorization (doesn't contain database, it registers to 3 lists in data.js)

The entire application is contained within the `index.js` file.

    `.env` create file and CREATE_ACCESS_TOKEN field add ADMIN_PASSWORD `

## Install

    npm install

## Run the app

    npm run start

## Run in development environment

    npm run dev

# REST API

---

## Login

## Request

### `POST /login`

## body

### username (unique), password (bcrypt hash) - ( required , minLength: 6 )

    curl -d "username=username&password=password"  http://localhost:3000/login

## Response

    {"token":"xxxxxxxxx"}

---

## SignUp

## Request

### `POST /signup`

## body

### username (unique), password (bcrypt hash) - ( required , minLength: 6 )

    curl -d "username=username&password=password"  http://localhost:3000/signup

## Response

    {"token":"xxxxxxxxx"}

---

## LogOut

## Request

### `POST /logout`

## Header

### Authorization: Bearer {token}

    curl -X POST -H "Authorization: Bearer {token}" http://localhost:3000/logout

## Response

    {"message":"Logout success"}

---

## Admin

## Request

### `POST /all`

## Header

### Authorization: Bearer {.env ADMIN_PASSWORD}

    curl -X POST -H "Authorization: Bearer {.env ADMIN_PASSWORD}" http://localhost:3000/all

## Response

    {

        "tokens":[
                    {
                        "token": "xxxxxxxxx",
                        "username": "username"
                    }
                ],

        "users":[
                    {
                        "username": "username",
                        "password": "password"
                    }
                ],

        "tasks":[
                    {
                        "username": "username",
                        "id": "6adf26105d37a5663d1b77588c55ac08",
                        "task": "Task 1",
                        "completed": false,
                        "createdDate": "9/12/2022, 3:53:57 PM"
                    }
                ]
    }

---

## Get Tasks

## Request

### `GET /tasks`

## Header

## Authorization: Bearer {token}

    curl -H "Authorization: Bearer {token}" http://localhost:3000/tasks

## Response

    {
        "tasks": [
                    {
                        "username": "username",
                        "id": "6adf26105d37a5663d1b77588c55ac08",
                        "task": "Task 1",
                        "completed": false,
                        "createdDate": "9/12/2022, 3:53:57 PM"
                    }
                ]
    }

---

## Create Task

## Request

### `POST /tasks`

## Header

## Authorization: Bearer {token}

    curl -H "Authorization: Bearer {token}" http://localhost:3000/tasks

## Body

## task : Task 1 ( required )

    curl -d "task=Task 1" -H "Authorization: Bearer {token}" http://localhost:3000/tasks

## Response

    {
        "task":
            {
                "username":"username",
                "id":"ef0d74284f497a69476be26e2ad12894",
                "task":"Task 1",
                "completed":false,
                "createdDate":"9/12/2022, 4:04:36 PM"
            }
        }

---

## Get Task

## Request

### `GET /tasks/:taskid`

## Header

## Authorization: Bearer {token}

## Params : taskid ( required )

    curl -H "Authorization: Bearer {token}" http://localhost:3000/tasks/taskid

## Response

    {
        "task":
            {
                "username":"username",
                "id":"ef0d74284f497a69476be26e2ad12894x",
                "task":"Task 2",
                "completed":false,
                "createdDate":"9/12/2022, 4:04:36 PM"
            }
        }
    }

---

## Update Task

## Request

### `PATCH /tasks/:taskid`

## Header

## Authorization: Bearer {token}

## Params : taskid ( required )

## Body : task (string) or completed (boolean) - ( required )

### "task=new task name&&completed=true"

    curl -X PATCH -H "Authorization: Bearer {token}" -d "task=new task name&&completed=true" http://localhost:3000/tasks/taskid

## Response

    {
        "task":
            {
                "username":"username",
                "id":"ef0d74284f497a69476be26e2ad12894x",
                "task":"new task name",
                "completed":false,
                "createdDate":"9/12/2022, 4:04:36 PM"
            }
        }
    }

---

## Delete Task

## Request

### `DELETE /tasks/:taskid`

## Header

## Authorization: Bearer {token}

## Params : taskid ( required )

    curl -X DELETE -H "Authorization: Bearer {token}" http://localhost:3000/tasks/taskid

## Response

    Status: 204 No Content

---
