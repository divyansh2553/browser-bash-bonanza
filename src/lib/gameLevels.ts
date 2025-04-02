
export interface Command {
  match: string | RegExp;
  response: string;
  success: boolean;
}

export interface Level {
  level: number;
  description: string;
  availableCommands: string[];
  commands: Command[];
  pointsValue: number;
}

export const gameLevels: Level[] = [
  // Level 1: Basic introduction
  {
    level: 1,
    description: "Welcome to your first mission! You need to access the secure system. Try logging in with the 'login' command.",
    availableCommands: ["login <username>", "inspect"],
    commands: [
      {
        match: "inspect",
        response: "You see a post-it note on the monitor with the username 'admin'.",
        success: false
      },
      {
        match: "login admin",
        response: "Login successful! You've gained access to the system.",
        success: true
      },
      {
        match: /^login (?!admin).+$/,
        response: "Access denied. Invalid username.",
        success: false
      }
    ],
    pointsValue: 10
  },
  
  // Level 2: File system navigation
  {
    level: 2,
    description: "You need to find a secret file in the system. Try navigating and listing files.",
    availableCommands: ["ls", "cd <directory>", "cat <filename>"],
    commands: [
      {
        match: "ls",
        response: "Documents/  Downloads/  secret.txt",
        success: false
      },
      {
        match: "cat secret.txt",
        response: "The password for the next level is: 'opensesame'",
        success: true
      },
      {
        match: /^cd .+$/,
        response: "Changed directory. Use 'ls' to list files here.",
        success: false
      }
    ],
    pointsValue: 15
  },
  
  // Level 3: Password decryption
  {
    level: 3,
    description: "You need to access a secure server. Use the password 'opensesame' to gain access.",
    availableCommands: ["connect", "password <password>", "decrypt"],
    commands: [
      {
        match: "connect",
        response: "Connecting to secure server... Password required.",
        success: false
      },
      {
        match: "password opensesame",
        response: "Password accepted! You've accessed the secure server.",
        success: true
      },
      {
        match: /^password (?!opensesame).+$/,
        response: "Invalid password. Access denied.",
        success: false
      },
      {
        match: "decrypt",
        response: "You need to connect to the server first before you can decrypt anything.",
        success: false
      }
    ],
    pointsValue: 20
  },
  
  // Level 4: Firewall bypass
  {
    level: 4,
    description: "There's a firewall blocking your access. Find a way to bypass it.",
    availableCommands: ["scan", "ping <ip>", "bypass <port>"],
    commands: [
      {
        match: "scan",
        response: "Scanning network...\nFirewall detected on port 8080.",
        success: false
      },
      {
        match: /^ping \d+\.\d+\.\d+\.\d+$/,
        response: "Pinging... No response received. The firewall is blocking ICMP traffic.",
        success: false
      },
      {
        match: "bypass 8080",
        response: "Firewall bypassed successfully! You now have access to the protected network.",
        success: true
      },
      {
        match: /^bypass (?!8080).+$/,
        response: "Bypass attempt failed. The firewall is still active.",
        success: false
      }
    ],
    pointsValue: 25
  },
  
  // Level 5: Final challenge
  {
    level: 5,
    description: "Final mission: Access the main server and capture the flag to complete your mission!",
    availableCommands: ["access", "hack", "capture", "download flag"],
    commands: [
      {
        match: "access",
        response: "Accessing main server... Security protocols active. You need to hack the mainframe first.",
        success: false
      },
      {
        match: "hack",
        response: "Hacking in progress... Success! The security system is now disabled.",
        success: false
      },
      {
        match: "capture",
        response: "What do you want to capture? Try being more specific.",
        success: false
      },
      {
        match: "download flag",
        response: "Flag captured! Mission complete! You are now a certified Browser Bash master!",
        success: true
      }
    ],
    pointsValue: 30
  }
];
