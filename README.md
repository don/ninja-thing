## Ninja Blocks driver for The Thing System

Send temperature and humidity data from [Ninja Blocks](http://ninjablocks.com/pages/home) to [The Thing System](http://thethingsystem.com/) via [TSRP](http://thethingsystem.com/dev/Thing-Sensor-Reporting-Protocol.html).

### Prerequisite

This driver requires newer APIs an only runs on Ninja Blocks greater than version 1.1.5. As of December 5, 2013 this means you need to run on the develop branch. See Ninja Blocks post about [setting up a development environment](http://ninjablocks.com/blogs/how-to/7195176-hack-like-a-ninja-blocks-developer).

Here's what I did for my Ninja Block

ssh to ninja block

    $ sudo stop ninjablock
    $ cd /opt
    $ mv ninja ninja-original
    $ git clone git://github.com/ninjablocks/client.git ninja
    $ git checkout develop
    $ ./bin/install.sh
    $ sudo start ninjablock
 
### Installing

ssh to your ninja block

    $ cd /opt/ninja/drivers
    $ git clone https://github.com/don/ninja-thing.git
    
Restart the Ninja Block

    $ sudo stop ninjablock
    $ sudo start ninjablock

After the driver is installed, you should see the Ninja Block Temperature and Humidity Sensors in The Thing System.

![alt text](https://github.com/don/ninja-thing/raw/master/ninjablock.png "Ninja Blocks")

![alt text](https://github.com/don/ninja-thing/raw/master/thethingsystem.png "The Thing System")

(c) 2013 Don Coleman
License [BSD](LICENSE.txt)


