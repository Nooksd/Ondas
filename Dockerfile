FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

RUN apt-get update && apt-get install -y --no-install-recommends \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/*

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Server/OndasAPI/OndasAPI.csproj Server/OndasAPI/
RUN dotnet restore "Server/OndasAPI/OndasAPI.csproj"

COPY . .

WORKDIR "/src/Server/OndasAPI"
RUN dotnet build "OndasAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OndasAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OndasAPI.dll"]
