from gtts import gTTS
import os
import subprocess

# The text content
slides = [
    "Climate tech has a dirty secret: great science, but zero execution. We are the Lifetime World. We are a Deep Tech ecosystem using Agentic AI and robotics to pull 2050 net-zero targets into 2026. And unlike most deep tech companies asking for money to start, we are asking for money to scale operations that are running today.",
    
    "We face a massive execution gap. Meet Sarah. She's 88, recovering from surgery, and ready to go home. But she can't. Why? Not because she is sick, but because she can't walk her dog or clean her floors. Because of this 'Last Meter' gap, she stays in the hospital, costing the system one thousand Euro a day and blocking a bed. We live in a world where we optimize the taxi ride but completely ignore the care. That is the Dignity Gap we solve.",
    
    "To close this gap, we built a full organism. The Brain is our DWS IQ Platform—ingesting global data and running optimization toward Society 5.0. The Body is Firehorse—agentic software born from our Lifetime Agent Foundry that plans and makes decisions. The Hands are Lifetime Fleet—robots, drones, and vehicles moving atoms in the real world. Brain, Body, and Hands—all owned and orchestrated by us in the World of Society 5.0.",
    
    "Our market entry is razor-sharp. We don't just sell rides; we sell the 'Recovery Rental'. This is a 6-week package sold to hospitals and families. We deploy a robot to the home to handle the 'dirty work'—logistics, cleaning, pet care—so the patient can heal. It is cheaper than a single hospital night, and it gives Sarah her independence back.",
    
    "We aren't building a silo; we are inside the ecosystem. Lifetime Fleet is already live on Uber's network in Finland. Riders can literally choose our cars today. We are also a contractor for Taksi Helsinki, handling national Kela patient travel. That's ten thousand Euro MRR and 15 assisted rides a day—purely with human drivers. Now, we are upgrading those same rides with robots to increase capacity and margin, not headcount.",
    
    "People ask: 'Do robots replace humans?' In our fleet, robots don't replace—they elevate. The robot carries a heavy wheelchair. The robot waits in the rain. This allows the human nurse to focus on medicine and the human driver to focus on driving. High tech, high touch.",
    
    "Now, the magic. How do we run this AI without burning cash? We utilize our 'Dirty Sweet' architecture. By combining NVIDIA edge computing with serverless Cloud Run, we have slashed our cloud costs to just 150 dollars a month. This architecture is validated by Google and AWS engineers. We have massive AI capability with an absurdly low cost base.",
    
    "Our revenue model maps to the organism. We charge SaaS fees for the Brain (DWS IQ licensing). We charge Service fees for the Hands (Recovery Rentals and Rides). We fund R&D today to dominate the NIS2-compliant EU market tomorrow.",
    
    "We aren't theorizing. We are Lifetime Studios—veterans in enterprise architecture and logistics. And we are backed by the Lifetime Consortium—an army of 150 specialized partners for hardware and compliance. We have the agility of a startup, the muscle of a giant, and the revenue to prove it.",
    
    "We are raising a 150 thousand Euro strategic bridge on a 3.8 Million Euro Valuation Cap. Because our cloud costs are near-zero, this money goes straight to atoms. The Target: Purchase 5 Robotic Assistants, hit 25 thousand Euro MRR, and sign our first major Hospital partnership. We have the network, the tech, and the contracts. This bridge buys the robots. Join Lifetime World. Thank you."
]

print("Generating audio... this may take a moment.")

# Generate individual MP3 files
filenames = []
for i, text in enumerate(slides):
    print(f"Processing Slide {i+1}...")
    # Generate speech for the slide
    tts = gTTS(text=text, lang='en', tld='com') # 'tld' can be changed to 'co.uk' for British accent
    filename = f"slide_{i+1}.mp3"
    tts.save(filename)
    filenames.append(filename)

# Create a file list for ffmpeg
with open("filelist.txt", "w") as f:
    for filename in filenames:
        f.write(f"file '{filename}'\n")
        # Add 5 seconds of silence after each file
        f.write("file 'silence.mp3'\n")

# Try to combine using ffmpeg if available, otherwise just keep individual files
try:
    # Create 5-second silence file using ffmpeg
    subprocess.run(["ffmpeg", "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100", "-t", "5", "silence.mp3"], 
                   check=True, capture_output=True)
    
    # Combine all files
    subprocess.run(["ffmpeg", "-f", "concat", "-safe", "0", "-i", "filelist.txt", 
                   "-c", "copy", "Lifetime_Presentation_Full_Audio.mp3"], 
                   check=True, capture_output=True)
    
    # Clean up
    os.remove("filelist.txt")
    os.remove("silence.mp3")
    print("Done! Saved as 'Lifetime_Presentation_Full_Audio.mp3'")
except (subprocess.CalledProcessError, FileNotFoundError):
    print("ffmpeg not found. Individual slide files have been generated.")
    print("To combine them, install ffmpeg and run:")
    print("  ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t 5 silence.mp3")
    print("  ffmpeg -f concat -safe 0 -i filelist.txt -c copy Lifetime_Presentation_Full_Audio.mp3")