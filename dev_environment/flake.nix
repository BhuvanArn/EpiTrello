{
  description = "Flake for EpiTrello";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.05";
  };

  outputs = { self , nixpkgs ,... }:
    let
      # system should match the system you are running on
      system = "x86_64-linux";
    in {
      devShells."${system}".default = let
        pkgs = import nixpkgs {
          inherit system;
        };
      in pkgs.mkShell {
        packages = with pkgs; [
          git
          nodejs
          pkg-config
          docker
          beekeeper-studio
        ];

        shellHook = ''
          echo EpiTrello JS nix-shell !
          echo -e "\e[97m"
        '';
      };
    };
}
