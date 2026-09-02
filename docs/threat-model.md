# Threat model

## What this is

`bare-path` is compiled into Bare. It is listed in `src/builtins.json`, so every Bare process has it. That holds whether or not the process sealed, and no code has to load anything to reach it.

So this addon is part of Bare, and [Bare's threat model](https://github.com/holepunchto/bare/blob/main/docs/threat-model.md) covers it. Read that one first. This one only says where this addon sits in it.

## What it inherits

- **The promise.** Bare promises a sealed process gets no new native code. This addon is native code that is already in, so the seal neither adds it nor takes it away.
- **The attacker.** Untrusted JavaScript in a sealed process. It writes what it likes, runs on as many threads as it wants, and calls anything it can reach in any order and all at once. It can reach all of this addon.
- **The trust.** This addon is trusted, because Bare compiles it in. Whatever you compile in is your security policy, and this is one of the things you picked.
- **The walls.** The same table applies. A thread is not a wall and neither is a realm, so nothing here gets to assume it is alone.
- **The rules.** What Bare says to report, and what Bare says is not a bug, is the same here.

## What counts

- **Counts:** `binding.c` and the JavaScript that ships with it. Sealed JavaScript reaches all of it without loading a thing.
- **Does not count:** tests, benchmarks, and scratch code.

## What this addon adds

String manipulation, and `cwd`, which gives back the process working directory.

`cwd` is the only thing here that reaches outside the process. What it gives away is one path, which tells sealed code a little about how the host filesystem is laid out.

Nothing here touches the filesystem. Joining a path does not open it. Reaching a store still needs a protocol, and this addon has none to give.

## Where the risk is

The C handles paths that an attacker chose, and the Windows rules are the fiddly part.

There is one more thing, and it is not about memory. What comes out of here feeds decisions made elsewhere. If something treats a path as safe because this normalized it, then this addon and the OS disagreeing matters at that call site. The bug is in whatever drew the conclusion rather than here, but it is a reason to be careful with what comes out.

## What to report

- Memory bugs in `binding.c` that JavaScript can reach, above all the buffer sizing in `cwd` and the Windows path parsing
- Any output that differs from what the platform itself resolves the same input to
- Anything on Bare's report list

Not a bug: that `cwd` gives you the working directory. Bare grants it, and an OS sandbox is what narrows what that directory is.
