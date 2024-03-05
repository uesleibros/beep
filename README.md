![](./logo.png)

# Beep — Discord Bot Tool

Beep is a tool to easy way for discord bot developers. Using a custom programming language **BeepLang**.

## BeepLang

Programming Language developed to work with bot commands using `$name[args]` interface.

### Example of say command
```cs
// !say
$nomention // Prevent mention user on bot send message.
$argsCheck[>0;Provide a text.] // Check if arguments are provided.
You say: $message // Bot will send this.
```
