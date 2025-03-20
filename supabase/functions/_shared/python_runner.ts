
/**
 * Utility function to run Python code in Deno
 */
export async function runPythonScript(
  pythonCode: string,
  args: string[] = []
): Promise<string> {
  // Create a temporary Python file
  const encoder = new TextEncoder();
  const tempFileName = `temp_${Date.now()}.py`;
  await Deno.writeFile(tempFileName, encoder.encode(pythonCode));

  try {
    // Build the command to run Python with the script and any arguments
    const cmd = ["python3", tempFileName, ...args];
    
    // Execute the Python script
    const process = Deno.run({
      cmd: cmd,
      stdout: "piped",
      stderr: "piped",
    });

    // Get the output
    const [status, stdout, stderr] = await Promise.all([
      process.status(),
      process.output(),
      process.stderrOutput(),
    ]);
    process.close();

    if (!status.success) {
      const errorString = new TextDecoder().decode(stderr);
      console.error("Python execution error:", errorString);
      throw new Error(`Python execution failed: ${errorString}`);
    }

    return new TextDecoder().decode(stdout);
  } finally {
    // Clean up the temporary file
    try {
      await Deno.remove(tempFileName);
    } catch (e) {
      console.error("Error removing temporary file:", e);
    }
  }
}
