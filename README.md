# populatio

Manage your population easily

## Available Endpoints

|  Name                      |    HTTP Method   |  Description                        |
|:---------------------------|:----------------:|:------------------------------------|
| /                          |       GET        | Fetch all locations                 |
| /?genre=female             |       GET        | Fetch by genre                      |
| /                          |       POST       | Create a new location               |
| /{location}                |       GET        | Fetch single location data          |
| /{location}/?genre=male    |       GET        | Fetch location data by genre        |
| /{location}                |       POST       | Create location under location      |
| /{location}                |       PUT        | Update location details             |
| /{location}                |       DELETE     | Delete location and it's details    |
