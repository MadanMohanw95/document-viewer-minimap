### Known issues:
# 1. minimap is not agnostic
Making it agnostic seems to require going against React's philosophy of state only flows down ... the solution right now is to lift the state up into the parent of both the left content and the minimap. A working gnostic solution is currently implemented.
Still exploring some options, but in the interest of time this solution works for side-by-side comparison
Note that the minimap does not have to update together with the left side - for small changes the user won't probably require 100% reaction on both, as the minimap is just a road map (overview) to the data being detailed on the left.
# 2. typescript is not 100% pure
Need more guidance on how pure is enough - did not want to spend a lot of effort on form given than functionality is there
# 3. paragraph splitting an merging is not properly handled by text processing of diffed text
May need to have a more complex processing function to go over '<ins>' and '<del>'

### Steps to run the project and app running locally

## Clone the project

## Run below command to install node modules 

`yarn install`

## Available Scripts

In the project directory, you can run:

`yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

