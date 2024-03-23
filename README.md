# Website
[Currently hosting from all_versions branch](https://sdp-team-22.github.io/website/)

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1-7-2024
- Have a couple frontend options
- Adding more things to to-do
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
~So, website hosting works. We can host from sdp repository directly too.
It only works for public repositories though, so maybe we can connect this public repo frontend to private backend? (not sure how to do this yet)~


## Running the App with Docker

Follow these steps to run the app using Docker:

1. Build the Docker image:
    ```bash
    docker build -t angular-fe-app .
    ```

2. Run the Docker container:
    ```bash
    docker run -d --name my-app -p 8080:80 angular-fe-app
    ```

    * This will run the container and expose it to the host's port 8080


