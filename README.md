BackboneApplicationExample
==========================

A JQuery tabbed Backbone application using routing.

George Frick

This application is a full blown example of using Backbone and various supporting libraries and tools to do real software development. Each includes file is commented, and everything is MIT license.

By demonstrating various usage patterns, gotchas, and corner implementations; an argument is made for an unobtrusive productivity gain. Backbone will never provide everything, but it will never take over. You don't have to use Backbone for everything, it can be another tool you apply to front end application design.

The use of RequireJS, Grunt, and Foundation showcase some of the power of modern front end development tools. We can gain productivity very similar to the backend. With well tested, optimized builds that aren't held back due to automation.

All of this combined should allow you to jump right into Backbone; without giving you an inch thick manual to work through. We all learn best by code and this is a living tutorial that you can hopefully learn from, bootstrap, and reference.


Use below to have grunt run by Maven as part of the build:
===========================================================
<plugin>
     <groupId>org.codehaus.mojo</groupId>
     <artifactId>exec-maven-plugin</artifactId>
     <version>1.2.1</version>
     <executions>
         <execution>
             <phase>prepare-package</phase>
             <goals>
                 <goal>exec</goal>
             </goals>
         </execution>
     </executions>
     <configuration>
         <executable>cmd</executable>
         <arguments>
             <argument>/c</argument>
             <argument>grunt</argument>
             <argument>--no-color</argument>
         </arguments>
     </configuration>
 </plugin>
