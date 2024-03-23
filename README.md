# Website
[Currently hosting from all_versions branch](https://sdp-team-22.github.io/website/)

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1-7-2024
- Have a couple frontend options
- Adding more things to to-do
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------



## Running the App with Docker

Follow these steps to run the app using Docker while being in the repo's root directory:

1. Build the Docker image:
    ```bash
    docker build -t angular-fe-app .
    ```

2. Run the Docker container:
    ```bash
    docker run -d --name my-app -p 8080:80 angular-fe-app
    ```

    * This will run the container and expose it to the host's port 8080

[Ref:](https://medium.com/@nadir.inab.dev/dockerizing-your-angular-app-a-quick-guide-00a3ecabe419)

(although this tutorial didn't work without modifying the dockerfile a bit)
