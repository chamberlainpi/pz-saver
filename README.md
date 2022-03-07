Project Zomboid Saver
=======================

![PZ-Saver Compact](https://raw.githubusercontent.com/chamberlainpi/pz-saver/main/docs/pz-saver-compact.png)

This is a node-based project to help maintain file-saves easier in Project Zomboid.

This Webapp periodically takes "snapshots" ZIPs of your current game save folder.
It alternates between 2 copies, which enables you to permanently save either:

 - **SAVE PREVIOUS** - Your previous snapshot (from X-seconds/minutes ago)
 - **SAVE NOW!** - Your most current snapshot (as soon as you set the **Enabled** toggle to **ON** & at the start of each cycle)

Case Scenario:
---------------
You're leveling up your Carpentry XP like a boss building a giant wooden wall around your base. You feel confident enough to fast-forward time in between each individual wall-building / plank pickup / log sawing actions ... but suddenly ....

## ***CRUNCH!@#$%*** 🧟

A Zombie pops out of nowhere and even though you fight back and put it out of it's misery... you know it's already too late - you're now **infected**, and you're gonna **DIE**! And that's not all... you're going to start from zero, nothing, zilch!

Well... **Until now!**


How to install / run it
-----------------------

First, you will need to have node/npm installed: https://nodejs.org/en/download/

If you're familiar with Git / Github, checkout this project on your machine.

If not, you can always download a ZIP copy of this project [right here](https://github.com/chamberlainpi/pz-saver/archive/refs/heads/main.zip) (I'll try to maintain a build ready to use with the latest code on this link), however you will still need to run some Terminal / CMD commands to run the background server that communicates between your PZ `/Saves/` folder and this Webapp.

Once you have that, open a Terminal / CMD window (on Windows: Windows-Key + R, then type `cmd`), navigate to this pz-saver directory, install the dependencies:

- `npm i` (or `yarn` if you prefer)

Then, launch the local server with:

- `npm run pz` (or `yarn pz` if you prefer)

Go to this URL in a browser tab/window:

`http://localhost:3000`

## First-Time setup

You'll need to access the **:gear: Advanced** button to set your `PZ-Root` folder.

Also, in the **Folders** panel, you will have to set a `Current` Save to have **PZ-Saver** focus on.

Once that's done, you should be able to hit the `Enabled` toggle to turn ON the timer.

# Restoring from a backup

So you've got bitten (Nooooooo!)

Not to worry! You can jump in the **:gear: Advanced** view and restore one of your  "snapshots" written on your HD (provided you Saved one of them). You can also delete any that you no longer need.

> These ZIP snapshots gets written to the `<PZ-Saver Root>/.private` folder.